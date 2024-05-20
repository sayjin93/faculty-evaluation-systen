const express = require('express');
const passport = require('passport');

const router = express.Router();
const auth = passport.authenticate('jwt', { session: false });

const { isAdminMiddleware } = require('../middlewares');
const departmentController = require('../controllers/department');

// Department routes
router.post('/', auth, isAdminMiddleware, departmentController.createDepartment);
router.get('/', departmentController.getAllDepartments);
router.get('/faculty/:faculty_id', auth, isAdminMiddleware, departmentController.getDepartmentsByFaculty);
router.get('/:id', auth, departmentController.getDepartmentById);
router.put('/:id', auth, isAdminMiddleware, departmentController.updateDepartment);
router.delete('/:id', auth, isAdminMiddleware, departmentController.deleteDepartment);
router.delete('/', auth, isAdminMiddleware, departmentController.deleteAllDepartments);

module.exports = router;
