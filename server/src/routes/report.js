const express = require('express');
const passport = require('passport');

const router = express.Router();
const auth = passport.authenticate('jwt', { session: false });

const { isAdminMiddleware } = require('../middlewares');
const statsController = require('../controllers/report');

// Statistics and Detailed Data routes
router.get('/stats', auth, isAdminMiddleware, statsController.getStats);
router.get('/stats/professor/:professor_id', auth, statsController.getProfessorStats);

router.get('/statsCards', auth, isAdminMiddleware, statsController.getStatsCards);
router.get('/statsCards/professor/:professor_id', auth, statsController.getProfessorStatsCards);

router.get('/professors-data', auth, isAdminMiddleware, statsController.getProfessorsData);
router.get('/professors-data/professor/:professor_id', auth, statsController.getProfessorData);

router.get('/academic_year/:academic_year_id/professor/:professor_id', auth, statsController.getProfessorDataByYear);

module.exports = router;
