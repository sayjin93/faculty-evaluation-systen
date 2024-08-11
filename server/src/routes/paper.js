const express = require('express');
const passport = require('passport');

const router = express.Router();
const auth = passport.authenticate('jwt', { session: false });

const { isAdminMiddleware } = require('../middlewares');
const paperController = require('../controllers/paper');

// Paper routes
router.post('/', auth, paperController.createPaper);

router.get('/', auth, isAdminMiddleware, paperController.getAllPapers);
router.get('/professor/:professor_id', auth, paperController.getPapersByProfessor);
router.get('/academic_year/:academic_year_id', auth, paperController.getPapersByYear);
router.get('/:id', auth, paperController.getPaperById);

router.put('/:id', auth, paperController.updatePaper);

router.delete('/:id', auth, isAdminMiddleware, paperController.deletePaper);
router.delete('/', auth, isAdminMiddleware, paperController.deleteAllPapers);

module.exports = router;
