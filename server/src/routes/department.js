const express = require('express');
const passport = require('passport');

const router = express.Router();
const auth = passport.authenticate('jwt', { session: false });

const { isAdminMiddleware } = require('../middlewares');
const departmentController = require('../controllers/department');

// Department routes
router.post('/', auth, isAdminMiddleware, departmentController.createDepartment);
router.get('/', departmentController.getAllDepartments);
router.get('/:id', auth, departmentController.getDepartmentById);
router.put('/:id', auth, isAdminMiddleware, departmentController.updateDepartment);
router.delete('/:id', auth, isAdminMiddleware, departmentController.deleteDepartment);
router.post('/restore/:id', auth, isAdminMiddleware, departmentController.restoreDepartments);

module.exports = router;
