const express = require('express');
const passport = require('passport');

const Professor = require('../models/professor');
const Book = require('../models/book');

const router = express.Router();

const auth = passport.authenticate('jwt', { session: false });

// Create a new Book
router.post('/', auth, async (req, res) => {
  // Validate request
  if (!req.body.title) {
    res.status(400).send({
      message: 'Content can not be empty',
    });
    return;
  }

  // Create a Book
  const bookData = {
    title: req.body.title,
    publication_house: req.body.publication_house,
    publication_year: req.body.publication_year || new Date(),
    academic_year_id: req.body.academic_year_id,
    professor_id: req.body.professor_id,
  };

  // Save Book in the database
  Book.create(bookData)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message
          || 'Some error occurred while creating the Book',
      });
    });
});

// Retrieve all Books
router.get('/', auth, async (req, res) => {
  const result = await Book.findAll().catch((err) => {
    console.log('Error: ', err);
  });

  if (!result) {
    return res.json({
      message: 'Does not exist any Book',
    });
  }

  res.json(result);
});

// Retrieve all Books with a specific academic_year_id
router.get('/academic_year/:academic_year_id', auth, async (req, res) => {
  const { academic_year_id } = req.params;

  Book.findAll({
    where: { academic_year_id },
    include: [
      {
        model: Professor,
        attributes: ['first_name', 'last_name'], // Specify the attributes you want to retrieve
      },
    ],
  })
    .then((data) => {
      const modifiedData = data.map((book) => ({
        id: book.id,
        title: book.title,
        publication_house: book.publication_house,
        publication_year: book.publication_year,
        academic_year_id: book.academic_year_id,
        professor_id: book.professor_id,
        createdAt: book.createdAt,
        updatedAt: book.updatedAt,
        professor_full_name: `${book.Professor.first_name} ${book.Professor.last_name}`,
      }));

      res.send(modifiedData);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Some error occurred while retrieving Books',
      });
    });
});

// Retrieve a single Book with id
router.get('/:id', auth, async (req, res) => {
  const { id } = req.params;

  Book.findByPk(id)
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find Book with id=${id}`,
        });
      }
    })
    .catch(() => {
      res.status(500).send({
        message: `Error retrieving Book with id=${id}`,
      });
    });
});

// Update a Book with id
router.put('/:id', auth, async (req, res) => {
  const { id } = req.params;

  Book.update(req.body, {
    where: { id },
  })
    .then((num) => {
      if (Number(num) === 1) {
        res.send({
          message: 'Book was updated successfully',
        });
      } else {
        res.send({
          message: `Cannot update Book with id=${id}. Maybe Book was not found or req.body is empty!`,
        });
      }
    })
    .catch(() => {
      res.status(500).send({
        message: `Error updating Book with id=${id}`,
      });
    });
});

// Delete a Book with id
router.delete('/:id', auth, async (req, res) => {
  const { id } = req.params;

  Book.destroy({
    where: { id },
  })
    .then((num) => {
      if (Number(num) === 1) {
        res.send({
          message: 'Book was deleted successfully',
        });
      } else {
        res.send({
          message: `Cannot delete Book with id=${id}. Maybe Book was not found!`,
        });
      }
    })
    .catch(() => {
      res.status(409).send({
        message: `Could not delete Book with id=${id}`,
      });
    });
});

// Delete all Books
router.delete('/', auth, async (req, res) => {
  Book.destroy({
    where: {},
    truncate: false,
  })
    .then((nums) => {
      res.send({
        message: `${nums} Books were deleted successfully`,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || 'Some error occurred while removing all Books',
      });
    });
});

module.exports = router;
