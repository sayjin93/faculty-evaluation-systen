const express = require('express');
const passport = require('passport');

const router = express.Router();
const auth = passport.authenticate('jwt', { session: false });

const { isAdminMiddleware } = require('../middlewares');
const facultyController = require('../controllers/faculty');

// Faculty routes
router.post('/', auth, isAdminMiddleware, facultyController.create);
router.post('/restore/:id', auth, isAdminMiddleware, facultyController.restore);

router.get('/', auth, isAdminMiddleware, facultyController.getAll);
router.get('/:id', auth, isAdminMiddleware, facultyController.getOne);

router.put('/:id', auth, isAdminMiddleware, facultyController.update);

router.delete('/:id', auth, isAdminMiddleware, facultyController.delete);

module.exports = router;
