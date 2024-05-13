const express = require('express');
const passport = require('passport');
const bookController = require('../controllers/book');

const router = express.Router();
const auth = passport.authenticate('jwt', { session: false });

// Book routes
router.post('/', auth, bookController.createBook);
router.get('/', auth, bookController.getAllBooks);
router.get('/academic_year/:academic_year_id', auth, bookController.getBooksByYear);
router.get('/:id', auth, bookController.getBookById);
router.put('/:id', auth, bookController.updateBook);
router.delete('/:id', auth, bookController.deleteBook);
router.delete('/', auth, bookController.deleteAllBooks);

module.exports = router;
