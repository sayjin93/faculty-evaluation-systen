module.exports = (app) => {
  const reports = require('../controllers/reports');
  const auth = require('../config/authenticate');
  const router = require('express').Router();

  // Retrieve all Papers with a specific academic_year_id and professor_id
  router.get(
    '/academic_year/:academic_year_id/professor/:professor_id',
    auth,
    reports.findAllByAcademicYearAndProfessor,
  );

  app.use('/api/reports', router);
};
