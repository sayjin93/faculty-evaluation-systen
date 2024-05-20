const express = require('express');
const passport = require('passport');

const router = express.Router();
const auth = passport.authenticate('jwt', { session: false });

const { isAdminMiddleware } = require('../middlewares');
const communityController = require('../controllers/community');

// Community service routes
router.post('/', auth, communityController.createCommunityService);
router.get('/', auth, communityController.getAllCommunityServices);
router.get('/academic_year/:academic_year_id', auth, communityController.getCommunityServicesByYear);
router.get('/:id', auth, communityController.getCommunityServiceById);
router.put('/:id', auth, communityController.updateCommunityService);
router.delete('/:id', auth, isAdminMiddleware, communityController.deleteCommunityService);
router.delete('/', auth, isAdminMiddleware, communityController.deleteAllCommunityServices);

module.exports = router;
