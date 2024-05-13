const fs = require('fs');
const path = require('path');
const { Translate } = require('@google-cloud/translate').v2;

const localesPath = process.env.LOCALES_PATH ? path.join(__dirname, process.env.LOCALES_PATH) : path.join(__dirname, '../../../client/public/locales');
const translate = new Translate({ key: process.env.GOOGLE_TRANSLATE_API_KEY });

// Helper to translate texts
const translateTexts = async (texts, targetLang) => Promise.all(texts.map((text) => translate.translate(text, targetLang)));

exports.getAllTranslations = (req, res) => {
  try {
    const languageFiles = fs.readdirSync(localesPath);
    const combinedTranslations = {};

    languageFiles.forEach((file) => {
      const filePath = path.join(localesPath, file);
      const fileContents = fs.readFileSync(filePath, 'utf-8');
      const translations = JSON.parse(fileContents);
      const languageKey = file.split('.')[0];

      Object.keys(translations).forEach((translationKey) => {
        if (!combinedTranslations[translationKey]) {
          combinedTranslations[translationKey] = { key: translationKey };
        }
        combinedTranslations[translationKey][languageKey] = translations[translationKey];
      });
    });

    const translationsArray = Object.values(combinedTranslations);
    res.json(translationsArray);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};

exports.getLanguages = (req, res) => {
  fs.readdir(localesPath, (err, files) => {
    if (err) {
      console.error('Error reading the locales directory:', err);
      return res.status(500).json({ success: false, error: 'Internal Server Error' });
    }

    const languages = files
      .filter((file) => file.endsWith('.json'))
      .map((file) => file.replace('.json', ''));

    res.json(languages);
  });
};

exports.addTranslation = (req, res) => {
  try {
    const translations = req.body;
    const languageFiles = fs.readdirSync(localesPath);

    languageFiles.forEach((file) => {
      const filePath = path.join(localesPath, file);
      const existingTranslations = fs.existsSync(filePath) ? JSON.parse(fs.readFileSync(filePath, 'utf-8')) : {};
      const updatedTranslations = { ...existingTranslations, ...translations };
      const sortedTranslations = {};

      Object.keys(updatedTranslations).sort().forEach((key) => {
        sortedTranslations[key] = translations[key] ? `${updatedTranslations[key]} (${file.split('.')[0].toUpperCase()})` : updatedTranslations[key];
      });

      fs.writeFileSync(filePath, JSON.stringify(sortedTranslations, null, 2));
    });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};

exports.updateTranslation = (req, res) => {
  const updatesArray = req.body;

  try {
    updatesArray.forEach((update) => {
      const { key, data } = update;

      Object.keys(data).forEach((lang) => {
        if (lang !== 'key') {
          const filePath = path.join(localesPath, `${lang}.json`);
          if (fs.existsSync(filePath)) {
            const translations = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
            translations[key] = data[lang];
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
};

exports.addLanguage = async (req, res) => {
  const newLangCode = req.body.lang;

  try {
    const baseLangPath = path.join(localesPath, 'en.json');
    const newLangPath = path.join(localesPath, `${newLangCode}.json`);

    if (fs.existsSync(newLangPath)) {
      return res.status(406).json({ success: false, error: 'Language already exists' });
    }

    const baseLangContent = JSON.parse(fs.readFileSync(baseLangPath, 'utf-8'));
    const keys = Object.keys(baseLangContent);
    const values = Object.values(baseLangContent);

    const translations = await translateTexts(values, newLangCode);
    const translatedContent = {};

    translations.forEach(([translated], index) => {
      translatedContent[keys[index]] = translated;
    });

    fs.writeFileSync(newLangPath, JSON.stringify(translatedContent, null, 2));
    const updatedLanguages = fs.readdirSync(localesPath).filter((file) => file.endsWith('.json')).map((file) => file.replace('.json', ''));

    res.status(200).json(updatedLanguages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};
