const express = require('express');
const passport = require('passport');

const router = express.Router();
const auth = passport.authenticate('jwt', { session: false });

const { isAdminMiddleware } = require('../middlewares');
const reportController = require('../controllers/report');

// Stats for active Academic Year
router.get('/statsAll', auth, isAdminMiddleware, reportController.getStatsAll);
router.get('/statsProfessor', auth, reportController.getStatsProfessor);

// Stats about Professors & Courses in total
router.get('/bigStats', auth, isAdminMiddleware, reportController.getBigStats);

// Stats foreach Academic Year
router.get('/statsCardsAll', auth, isAdminMiddleware, reportController.getStatsCardsAll);
router.get('/statsCardsProfessor', auth, reportController.getStatsCardsProfessor);

// All Stats Data
router.get('/professorDataAll', auth, isAdminMiddleware, reportController.getProfessorDataAll);
router.get('/professorDataProfessor', auth, reportController.getProfessorDataProfessor);

// Detailed Data for 1 Professor for e specific Academic Year
router.get('/professor-activity/:academic_year_id/:professor_id', auth, reportController.getProfessorActivityByAcademicYear);

// Department-wise Distribution
router.get('/department-wise-distribution/:academic_year_id/:faculty_id', auth, isAdminMiddleware, reportController.getDepartmentWiseDistribution);

// Course Load Analysis
router.get('/course-load-analysis/:academic_year_id/:faculty_id', auth, isAdminMiddleware, reportController.getCourseLoadAnalysis);

// Gender Distribution
router.get('/gender-distribution/:faculty_id/:department_id', auth, isAdminMiddleware, reportController.getGenderDistribution);

module.exports = router;
