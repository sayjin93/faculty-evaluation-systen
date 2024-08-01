const express = require('express');
const passport = require('passport');

const router = express.Router();
const auth = passport.authenticate('jwt', { session: false });

const { isAdminMiddleware } = require('../middlewares');
const statsController = require('../controllers/report');

// Stats for active Academic Year
router.get('/stats', auth, isAdminMiddleware, statsController.getStats);

// Stats for 1 Professor in active Academic Year
router.get('/stats/professor/:professor_id', auth, statsController.getProfessorStats);

// Stats about Professors & Courses in total
router.get('/bigStats', auth, isAdminMiddleware, statsController.getBigStats);

// Stats foreach Academic Year for all university
router.get('/statsCards', auth, isAdminMiddleware, statsController.getStatsCards);

// Stats foreach Academic Year for 1 professor
router.get('/statsCards/professor/:professor_id', auth, statsController.getProfessorStatsCards);

// All Stats for all professors
router.get('/professors-data', auth, isAdminMiddleware, statsController.getProfessorsData);

// All Stats for 1 professors
router.get('/professors-data/professor/:professor_id', auth, statsController.getProfessorData);

// Detailed Data for 1 Professor for e specific Academic Year
router.get('/academic_year/:academic_year_id/professor/:professor_id', auth, statsController.getProfessorDataByYear);

module.exports = router;
