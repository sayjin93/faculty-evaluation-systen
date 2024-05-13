const express = require('express');
const passport = require('passport');
const statsController = require('../controllers/report');

const router = express.Router();
const auth = passport.authenticate('jwt', { session: false });

// Statistics and Detailed Data routes
router.get('/stats', auth, statsController.getStats);
router.get('/statsCards', auth, statsController.getStatsCards);
router.get('/professors-data', auth, statsController.getProfessorsData);
router.get('/academic_year/:academic_year_id/professor/:professor_id', auth, statsController.getProfessorDataByYear);

module.exports = router;
