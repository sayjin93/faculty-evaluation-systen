module.exports = (app) => {
  const books = require('../controllers/books.controller.js');
  const auth = require('../config/authenticate');
  const router = require('express').Router();

  // Create a new Book
  router.post('/', auth, books.create);

  // Retrieve all Books
  router.get('/', auth, books.findAll);

  // Retrieve all Books with a specific academic_year_id
  router.get(
    '/academic_year/:academic_year_id',
    auth,
    books.findAllByAcademicYear,
  );

  // Retrieve a single Book with id
  router.get('/:id', auth, books.findOne);

  // Update a Book with id
  router.put('/:id', auth, books.update);

  // Delete a Book with id
  router.delete('/:id', auth, books.delete);

  // Delete all Books
  router.delete('/', auth, books.deleteAll);

  app.use('/api/books', auth, router);
};
