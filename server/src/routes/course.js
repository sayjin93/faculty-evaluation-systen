const express = require('express');
const passport = require('passport');

const router = express.Router();
const auth = passport.authenticate('jwt', { session: false });

const { isAdminMiddleware } = require('../middlewares');
const courseController = require('../controllers/course');

// Course routes
router.post('/', auth, courseController.createCourse);

router.get('/', auth, isAdminMiddleware, courseController.getAllCourses);
router.get('/professor/:professor_id', auth, courseController.getCoursesByProfessor);

router.get('/academic_year/:academic_year_id', auth, courseController.getCoursesByYear);
router.get('/:id', auth, courseController.getCourseById);
router.put('/:id', auth, courseController.updateCourse);

router.delete('/:id', auth, isAdminMiddleware, courseController.deleteCourse);
router.delete('/', auth, isAdminMiddleware, courseController.deleteAllCourses);

module.exports = router;
