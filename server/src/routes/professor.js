const express = require('express');
const passport = require('passport');

const router = express.Router();
const auth = passport.authenticate('jwt', { session: false });

const { isAdminMiddleware } = require('../middlewares');
const professorController = require('../controllers/professor');

// Professor routes
router.post('/', auth, isAdminMiddleware, professorController.create);
router.post('/restore/:id', auth, isAdminMiddleware, professorController.restore);

router.get('/', auth, professorController.getAll);
router.get('/:id', auth, professorController.getOne);

router.put('/:id', auth, professorController.update);

router.delete('/:id', auth, isAdminMiddleware, professorController.delete);
module.exports = router;
