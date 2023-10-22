module.exports = (app) => {
  const courses = require('../controllers/courses');
  const auth = require('../config/authenticate');
  const router = require('express').Router();

  // Create a new Course
  router.post('/', auth, courses.create);

  // Retrieve all Courses
  router.get('/', auth, courses.findAll);

  // Retrieve all Courses with a specific academic_year_id
  router.get(
    '/academic_year/:academic_year_id',
    auth,
    courses.findAllByAcademicYear,
  );

  // Retrieve a single Course with id
  router.get('/:id', auth, courses.findOne);

  // Update a Course with id
  router.put('/:id', auth, courses.update);

  // Delete a Course with id
  router.delete('/:id', auth, courses.delete);

  // Delete all Courses
  router.delete('/', auth, courses.deleteAll);

  app.use('/api/courses', router);
};
