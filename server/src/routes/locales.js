const express = require('express');
const passport = require('passport');

const router = express.Router();
const auth = passport.authenticate('jwt', { session: false });

const { isAdminMiddleware } = require('../middlewares');
const translationController = require('../controllers/locales');

// Translation routes
router.get('/', auth, isAdminMiddleware, translationController.getAllTranslations);
router.get('/languages', translationController.getLanguages);

router.post('/add', auth, translationController.addTranslation);
router.post('/update', auth, isAdminMiddleware, translationController.updateTranslation);
router.post('/add-language', auth, isAdminMiddleware, translationController.addLanguage);

module.exports = router;
