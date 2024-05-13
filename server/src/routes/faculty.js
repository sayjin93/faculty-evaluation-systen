const express = require('express');
const passport = require('passport');
const facultyController = require('../controllers/faculty');

const router = express.Router();
const auth = passport.authenticate('jwt', { session: false });

// Faculty routes
router.post('/', auth, facultyController.createFaculty);
router.get('/', facultyController.getAllFaculties);
router.get('/:id', auth, facultyController.getFacultyById);
router.put('/:id', auth, facultyController.updateFaculty);
router.delete('/:id', auth, facultyController.deleteFaculty);
router.delete('/', auth, facultyController.deleteAllFaculties);

module.exports = router;
