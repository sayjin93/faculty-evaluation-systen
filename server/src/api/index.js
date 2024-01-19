const express = require('express');

const authApi = require('./auth');
const localesApi = require('./locales');

const facultyApi = require('./faculty');
const deparmentApi = require('./department');
const academicYearApi = require('./academicYear');
const bookApi = require('./book');
const communityApi = require('./community');
const conferenceApi = require('./conference');
const courseApi = require('./course');
const paperApi = require('./paper');
const professorApi = require('./professor');
const reportApi = require('./report');
const settingsApi = require('./settings');

const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    message: 'API - 👋🌎🌍🌏',
  });
});

router.use(authApi);
router.use('/locales', localesApi);
router.use('/faculty', facultyApi);
router.use('/department', deparmentApi);
router.use('/academic-year', academicYearApi);
router.use('/book', bookApi);
router.use('/community', communityApi);
router.use('/conference', conferenceApi);
router.use('/course', courseApi);
router.use('/paper', paperApi);
router.use('/professor', professorApi);
router.use('/report', reportApi);
router.use('/settings', settingsApi);

module.exports = router;
