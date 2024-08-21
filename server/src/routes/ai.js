const express = require('express');
const passport = require('passport');

const router = express.Router();
const auth = passport.authenticate('jwt', { session: false });

const summarizeController = require('../controllers/summarize');

// Summarize routes
router.post('/summarize', auth, summarizeController.create);
router.get('/summarize/', auth, summarizeController.getByProfessor);
router.delete('/summarize/:id', auth, summarizeController.delete);

module.exports = router;
