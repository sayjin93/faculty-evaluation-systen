const express = require('express');
const passport = require('passport');

const router = express.Router();
const auth = passport.authenticate('jwt', { session: false });

const { isAdminMiddleware } = require('../middlewares');
const bookController = require('../controllers/book');

// Book routes
router.post('/', auth, bookController.createBook);
router.get('/', auth, bookController.getAllBooks);
router.get('/academic_year/:academic_year_id', auth, bookController.getBooksByYear);
router.get('/:id', auth, bookController.getBookById);
router.put('/:id', auth, bookController.updateBook);
router.delete('/:id', auth, isAdminMiddleware, bookController.deleteBook);
router.delete('/', auth, isAdminMiddleware, bookController.deleteAllBooks);

module.exports = router;
