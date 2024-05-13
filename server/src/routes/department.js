const express = require('express');
const passport = require('passport');
const departmentController = require('../controllers/department');

const router = express.Router();
const auth = passport.authenticate('jwt', { session: false });

// Department routes
router.post('/', auth, departmentController.createDepartment);
router.get('/', departmentController.getAllDepartments);
router.get('/faculty/:faculty_id', auth, departmentController.getDepartmentsByFaculty);
router.get('/:id', auth, departmentController.getDepartmentById);
router.put('/:id', auth, departmentController.updateDepartment);
router.delete('/:id', auth, departmentController.deleteDepartment);
router.delete('/', auth, departmentController.deleteAllDepartments);

module.exports = router;
