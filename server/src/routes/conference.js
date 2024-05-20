const express = require('express');
const passport = require('passport');

const router = express.Router();
const auth = passport.authenticate('jwt', { session: false });

const { isAdminMiddleware } = require('../middlewares');
const conferenceController = require('../controllers/conference');

// Conference routes
router.post('/', auth, conferenceController.createConference);
router.get('/', auth, conferenceController.getAllConferences);
router.get('/academic_year/:academic_year_id', auth, conferenceController.getConferencesByYear);
router.get('/:id', auth, conferenceController.getConferenceById);
router.put('/:id', auth, conferenceController.updateConference);
router.delete('/:id', auth, isAdminMiddleware, conferenceController.deleteConference);
router.delete('/', auth, isAdminMiddleware, conferenceController.deleteAllConferences);

module.exports = router;
