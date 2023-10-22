const db = require('../models');

const Books = db.books;

// Create and Save a new Books
exports.create = (req, res) => {
  // Validate request
  if (!req.body.title) {
    res.status(400).send({
      message: 'Content can not be empty!',
    });
    return;
  }

  // Create a Books
  const bookData = {
    title: req.body.title,
    publication_house: req.body.publication_house,
    publication_year: req.body.publication_year || new Date(),
    academic_year_id: req.body.academic_year_id,
    professor_id: req.body.professor_id,
  };

  // Save Books in the database
  Books.create(bookData)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Some error occurred while creating the Book.',
      });
    });
};

// Retrieve all Bookss from the database.
exports.findAll = (req, res) => {
  Books.findAll()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Some error occurred while retrieving Bookss.',
      });
    });
};

// Find a single Books with an id
exports.findOne = (req, res) => {
  const { id } = req.params;

  Books.findByPk(id)
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find Books with id=${id}.`,
        });
      }
    })
    .catch(() => {
      res.status(500).send({
        message: `Error retrieving Books with id=${id}`,
      });
    });
};

// Update a Books by the id in the request
exports.update = (req, res) => {
  const { id } = req.params;

  Books.update(req.body, {
    where: { id },
  })
    .then((num) => {
      if (num === 1) {
        res.send({
          message: 'Books was updated successfully.',
        });
      } else {
        res.send({
          message: `Cannot update Books with id=${id}. Maybe Books was not found or req.body is empty!`,
        });
      }
    })
    .catch(() => {
      res.status(500).send({
        message: `Error updating Books with id=${id}`,
      });
    });
};

// Delete a Books with the specified id in the request
exports.delete = (req, res) => {
  const { id } = req.params;

  Books.destroy({
    where: { id },
  })
    .then((num) => {
      if (num === 1) {
        res.send({
          message: 'Books was deleted successfully!',
        });
      } else {
        res.send({
          message: `Cannot delete Books with id=${id}. Maybe Books was not found!`,
        });
      }
    })
    .catch(() => {
      res.status(500).send({
        message: `Could not delete Books with id=${id}`,
      });
    });
};

// Delete all Books from the database.
exports.deleteAll = (req, res) => {
  Books.destroy({
    where: {},
    truncate: false,
  })
    .then((nums) => {
      res.send({ message: `${nums} Bookss were deleted successfully!` });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || 'Some error occurred while removing all Bookss.',
      });
    });
};

// Find all Books with a specific academic_year_id
exports.findAllByAcademicYear = (req, res) => {
  const { academic_year_id } = req.params;

  Books.findAll({ where: { academic_year_id } })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Some error occurred while retrieving Courses.',
      });
    });
};
