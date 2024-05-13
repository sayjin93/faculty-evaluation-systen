const express = require('express');
const passport = require('passport');
const professorController = require('../controllers/professor');

const router = express.Router();
const auth = passport.authenticate('jwt', { session: false });

// Professor routes
router.post('/', auth, professorController.createProfessor);
router.get('/', auth, professorController.getAllProfessors);
router.get('/:id', auth, professorController.getProfessorById);
router.put('/:id', auth, professorController.updateProfessor);
router.delete('/:id', auth, professorController.deleteProfessor);
router.delete('/', auth, professorController.deleteAllProfessors);

module.exports = router;
