const express = require('express');
const passport = require('passport');
const fs = require('fs');
const path = require('path');

const router = express.Router();

const auth = passport.authenticate('jwt', { session: false });

let localesPath = path.join(__dirname, '../../../client/public/locales');
if (process.env.LOCALES_PATH) localesPath = path.join(__dirname, process.env.LOCALES_PATH);

// Imports the Google Cloud client library
const { Translate } = require('@google-cloud/translate').v2;

// Configure the translation client with your API key
const translate = new Translate({ key: process.env.GOOGLE_TRANSLATE_API_KEY });
const translateTexts = async (texts, targetLang) => Promise.all(texts.map((text) => translate.translate(text, targetLang)));

// GET route to retrieve all keys for all languages
router.get('/', auth, (req, res) => {
  try {
    const languageFiles = fs.readdirSync(localesPath);
    const combinedTranslations = {};

    // Combine translations from all files
    languageFiles.forEach((file) => {
      const filePath = path.join(localesPath, file);
      const fileContents = fs.readFileSync(filePath, 'utf-8');
      const translations = JSON.parse(fileContents);
      const languageKey = file.split('.')[0]; // e.g., 'en' for 'en.json'

      // Add each translation to the combinedTranslations object
      Object.keys(translations).forEach((translationKey) => {
        if (!combinedTranslations[translationKey]) {
          combinedTranslations[translationKey] = { key: translationKey };
        }
        combinedTranslations[translationKey][languageKey] = translations[translationKey];
      });
    });

    // Convert combinedTranslations object to the desired array structure
    const translationsArray = Object.values(combinedTranslations);

    // Send the response
    res.json(translationsArray);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

// GET route to retrieve all available languages
router.get('/languages', (req, res) => {
  fs.readdir(localesPath, (err, files) => {
    if (err) {
      console.error('Error reading the locales directory:', err);
      return res.status(500).json({ success: false, error: 'Internal Server Error' });
    }

    // Extract language codes from file names (assuming they're in the format 'en.json', 'de.json', etc.)
    const languages = files
      .filter((file) => file.endsWith('.json')) // Ensure it's a JSON file
      .map((file) => file.replace('.json', '')); // Remove the extension to get the language code

    res.json(languages);
  });
});

// Add key automatically in json files if i18n read a new key
router.post('/add', auth, (req, res) => {
  try {
    const translations = req.body;

    // Construct the file path for each language file
    const languageFiles = fs.readdirSync(localesPath);

    languageFiles.forEach((file) => {
      const filePath = path.join(localesPath, file);

      // Load existing translations or create an empty object if the file doesn't exist
      const existingTranslations = fs.existsSync(filePath)
        ? JSON.parse(fs.readFileSync(filePath, 'utf-8'))
        : {};

      // Merge existing translations with the new ones
      const updatedTranslations = { ...existingTranslations, ...translations };

      // Sort translations alphabetically by key
      const sortedTranslations = {};
      Object.keys(updatedTranslations)
        .sort()
        .forEach((key) => {
          sortedTranslations[key] = translations[key] ? `${updatedTranslations[key]} (${file.split('.')[0].toUpperCase()})` : updatedTranslations[key];
        });

      // Save the sorted translations back to the file
      fs.writeFileSync(filePath, JSON.stringify(sortedTranslations, null, 2));
    });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

// Update key values in json files
router.post('/update', auth, (req, res) => {
  const updatesArray = req.body; // Assuming this is the array you receive

  try {
    updatesArray.forEach((update) => {
      const { key, data } = update;

      // Update each language file
      Object.keys(data).forEach((lang) => {
        if (lang !== 'key') { // Skip the 'key' field as it's not a language code
          const filePath = path.join(localesPath, `${lang}.json`);
          if (fs.existsSync(filePath)) {
            const fileContents = fs.readFileSync(filePath, 'utf-8');
            const translations = JSON.parse(fileContents);

            // Update the specific translation
            translations[key] = data[lang];

            // Write the updated translations back to the file
            fs.writeFileSync(filePath, JSON.stringify(translations, null, 2));
          }
        }
      });
    });

    res.json({ success: true, message: 'Translations updated' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

// Add new language
router.post('/add-language', auth, async (req, res) => {
  const newLangCode = req.body.lang; // The language code sent from the request, e.g., 'de'

  try {
    const baseLangPath = path.join(localesPath, 'en.json');
    const newLangPath = path.join(localesPath, `${newLangCode}.json`);

    // Check if the new language file already exists
    if (fs.existsSync(newLangPath)) {
      return res.status(406).json({ success: false, error: 'Language already exists' });
    }

    const baseLangContent = JSON.parse(fs.readFileSync(baseLangPath, 'utf-8'));
    const keys = Object.keys(baseLangContent);
    const values = Object.values(baseLangContent);

    // Translate all texts in parallel
    const translations = await translateTexts(values, newLangCode);

    // Combine keys and translations into an object
    const translatedContent = {};
    translations.forEach(([translated], index) => {
      translatedContent[keys[index]] = translated;
    });

    // Write the new language file
    fs.writeFileSync(newLangPath, JSON.stringify(translatedContent, null, 2));

    // Read the locales directory to get an updated list of languages
    const updatedLanguages = fs.readdirSync(localesPath)
      .filter((file) => file.endsWith('.json'))
      .map((file) => file.replace('.json', ''));

    // Return the updated list of languages
    res.status(200).json(updatedLanguages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

module.exports = router;
