const express = require('express');
const passport = require('passport');
const courseController = require('../controllers/course');

const router = express.Router();
const auth = passport.authenticate('jwt', { session: false });

// Course routes
router.post('/', auth, courseController.createCourse);
router.get('/', auth, courseController.getAllCourses);
router.get('/academic_year/:academic_year_id', auth, courseController.getCoursesByYear);
router.get('/:id', auth, courseController.getCourseById);
router.put('/:id', auth, courseController.updateCourse);
router.delete('/:id', auth, courseController.deleteCourse);
router.delete('/', auth, courseController.deleteAllCourses);

module.exports = router;
