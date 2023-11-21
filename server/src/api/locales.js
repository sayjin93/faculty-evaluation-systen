const express = require('express');

const fs = require('fs');
const path = require('path');

const router = express.Router();

// GET route to retrieve available languages
router.get('/locales', (req, res) => {
  // Construct the file path for the translations file
  const localesPath = path.join(__dirname, '../../../client/public/locales');

  try {
    // Check if the directory exists
    if (fs.existsSync(localesPath)) {
      // Read the existing items in the locales folder
      const allItems = fs.readdirSync(localesPath);

      // Filter out only directories
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

router.post('/locales/add/:lng/:ns', (req, res) => {
  try {
    // Extract language (lng) and namespace (ns) from the request parameters
    const { lng, ns } = req.params;
    const translations = req.body;

    // Construct the file path for the translations file
    const filePath = path.join(__dirname, '../../../client/public/locales', lng, `${ns}.json`);

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
        sortedTranslations[key] = updatedTranslations[key];
      });

    // Save the sorted translations back to the file
    fs.writeFileSync(filePath, JSON.stringify(sortedTranslations, null, 2));

    // Respond with a success status
    res.status(200).json({ success: true });
  } catch (error) {
    // Handle errors and respond with an appropriate status
    console.error(error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

module.exports = router;
