const express = require('express');
const passport = require('passport');

const router = express.Router();
const auth = passport.authenticate('jwt', { session: false });

const academicYearController = require('../controllers/academicYear');

router.post('/', auth, academicYearController.createAcademicYear);
router.get('/', auth, academicYearController.listAll);
router.get('/active', auth, academicYearController.listActive);
router.get('/:id', auth, academicYearController.findAcademicYearById);
router.put('/:id', auth, academicYearController.updateAcademicYear);
router.put('/active/:id', auth, academicYearController.updateActiveStatus);
router.delete('/:id', auth, academicYearController.deleteAcademicYear);
router.delete('/', auth, academicYearController.deleteAllAcademicYears);

module.exports = router;
