const express = require('express');
const passport = require('passport');

const router = express.Router();
const auth = passport.authenticate('jwt', { session: false });

const { isAdminMiddleware } = require('../middlewares');
const reportController = require('../controllers/report');

// Stats for active Academic Year
router.get('/stats', auth, isAdminMiddleware, reportController.getStats);

// Stats for 1 Professor in active Academic Year
router.get('/stats/:professor_id', auth, reportController.getProfessorStats);

// Stats about Professors & Courses in total
router.get('/bigStats', auth, isAdminMiddleware, reportController.getBigStats);

// Stats foreach Academic Year for all university
router.get('/statsCards', auth, isAdminMiddleware, reportController.getStatsCards);

// Stats foreach Academic Year for 1 professor
router.get('/statsCards/:professor_id', auth, reportController.getProfessorStatsCards);

// All Stats for all professors
router.get('/professors-data', auth, isAdminMiddleware, reportController.getProfessorsData);

// All Stats for 1 professors
router.get('/professors-data/:professor_id', auth, reportController.getProfessorData);

// Detailed Data for 1 Professor for e specific Academic Year
router.get('/professor-activity/:academic_year_id/:professor_id', auth, reportController.getProfessorActivityByAcademicYear);

// Department-wise Distribution
router.get('/department-wise-distribution/:academic_year_id/:faculty_id', auth, isAdminMiddleware, reportController.getDepartmentWiseDistribution);

// Course Load Analysis
router.get('/course-load-analysis/:academicYearId', auth, isAdminMiddleware, reportController.getCourseLoadAnalysis);

module.exports = router;
