const express = require('express');
const passport = require('passport');
const settingsController = require('../controllers/settings');

const router = express.Router();
const auth = passport.authenticate('jwt', { session: false });

// Settings routes
router.get('/', auth, settingsController.getAllSettings);
router.get('/email', auth, settingsController.getEmailSettings);
router.put('/email', auth, settingsController.saveEmailSettings);

module.exports = router;
