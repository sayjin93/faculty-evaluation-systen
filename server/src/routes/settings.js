const express = require('express');
const passport = require('passport');

const router = express.Router();
const auth = passport.authenticate('jwt', { session: false });

const { isAdminMiddleware } = require('../middlewares');
const settingsController = require('../controllers/settings');

// Settings routes
router.get('/', auth, settingsController.getAllSettings);
router.get('/email', auth, isAdminMiddleware, settingsController.getEmailSettings);

router.put('/email', auth, isAdminMiddleware, settingsController.saveEmailSettings);

module.exports = router;
