const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();

// GET route to retrieve available languages
router.get('/', (req, res) => {
  const localesPath = path.join(__dirname, '../../../client/public/locales');

  try {
    if (fs.existsSync(localesPath)) {
      const allItems = fs.readdirSync(localesPath);

      const languageFolders = allItems.filter((item) => {
        const itemPath = path.join(localesPath, item);
        return fs.statSync(itemPath).isDirectory();
      });

      res.status(200).json(languageFolders);
    } else {
      res.status(404).send('Directory not found');
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Internal Server Error');
  }
});

router.post('/add/key', (req, res) => {
  try {
    const translations = req.body;

    // Construct the file path for each language file
    const localesPath = path.join(__dirname, '../../../client/public/locales');
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

module.exports = router;
