const express = require('express');
const passport = require('passport');

const router = express.Router();
const auth = passport.authenticate('jwt', { session: false });

const { isAdminMiddleware } = require('../middlewares');
const departmentController = require('../controllers/department');

// Department routes
router.post('/', auth, isAdminMiddleware, departmentController.create);
router.post('/restore/:id', auth, isAdminMiddleware, departmentController.restore);

router.get('/', departmentController.getAll);
router.get('/:id', auth, departmentController.getOne);

router.put('/:id', auth, isAdminMiddleware, departmentController.update);

router.delete('/:id', auth, isAdminMiddleware, departmentController.delete);

module.exports = router;
