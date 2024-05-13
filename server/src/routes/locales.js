const express = require('express');
const passport = require('passport');
const translationController = require('../controllers/locales');

const router = express.Router();
const auth = passport.authenticate('jwt', { session: false });

// Translation routes
router.get('/', auth, translationController.getAllTranslations);
router.get('/languages', translationController.getLanguages);
router.post('/add', auth, translationController.addTranslation);
router.post('/update', auth, translationController.updateTranslation);
router.post('/add-language', auth, translationController.addLanguage);

module.exports = router;
