const express = require('express');
const passport = require('passport');

const router = express.Router();
const auth = passport.authenticate('jwt', { session: false });

const { isAdminMiddleware } = require('../middlewares');
const professorController = require('../controllers/professor');

// Professor routes
router.post('/', auth, isAdminMiddleware, professorController.createProfessor);
router.get('/', auth, professorController.getAllProfessors);
router.get('/:id', auth, professorController.getProfessorById);
router.put('/:id', auth, professorController.updateProfessor);
router.delete('/:id', auth, isAdminMiddleware, professorController.deleteProfessor);
router.delete('/', auth, isAdminMiddleware, professorController.deleteAllProfessors);

module.exports = router;
