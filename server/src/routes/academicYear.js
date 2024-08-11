const express = require('express');
const passport = require('passport');

const router = express.Router();
const auth = passport.authenticate('jwt', { session: false });

const { isAdminMiddleware } = require('../middlewares');
const academicYearController = require('../controllers/academicYear');

router.post('/', auth, isAdminMiddleware, academicYearController.createAcademicYear);

router.get('/', auth, academicYearController.getAll);
router.get('/active', auth, academicYearController.getActive);
router.get('/:id', auth, academicYearController.getOne);

router.put('/:id', auth, academicYearController.update);
router.put('/active/:id', auth, academicYearController.updateActive);

router.delete('/:id', auth, isAdminMiddleware, academicYearController.delete);

module.exports = router;
