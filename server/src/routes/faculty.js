const express = require('express');
const passport = require('passport');

const router = express.Router();
const auth = passport.authenticate('jwt', { session: false });

const { isAdminMiddleware } = require('../middlewares');
const facultyController = require('../controllers/faculty');

// Faculty routes
router.post('/', auth, isAdminMiddleware, facultyController.createFaculty);
router.get('/', auth, isAdminMiddleware, facultyController.getAllFaculties);
router.get('/:id', auth, isAdminMiddleware, facultyController.getFacultyById);
router.put('/:id', auth, isAdminMiddleware, facultyController.updateFaculty);
router.delete('/:id', auth, isAdminMiddleware, facultyController.deleteFaculty);
router.delete('/', auth, isAdminMiddleware, facultyController.deleteAllFaculties);

module.exports = router;
