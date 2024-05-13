const express = require('express');
const authController = require('../controllers/auth');

const router = express.Router();

// Authentication and User Management routes
router.post('/login', authController.login);
router.post('/register', authController.register);
router.get('/verify/:token', authController.verifyAccount);
router.post('/reset', authController.requestPasswordReset);
router.get('/reset/:token', authController.resetPasswordTokenValidation);
router.post('/reset/:token', authController.resetPassword);

module.exports = router;
