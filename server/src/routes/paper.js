const express = require('express');
const passport = require('passport');
const paperController = require('../controllers/paper');

const router = express.Router();
const auth = passport.authenticate('jwt', { session: false });

// Paper routes
router.post('/', auth, paperController.createPaper);
router.get('/', auth, paperController.getAllPapers);
router.get('/academic_year/:academic_year_id', auth, paperController.getPapersByYear);
router.get('/:id', auth, paperController.getPaperById);
router.put('/:id', auth, paperController.updatePaper);
router.delete('/:id', auth, paperController.deletePaper);
router.delete('/', auth, paperController.deleteAllPapers);

module.exports = router;
