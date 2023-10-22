const db = require('../models');

const Papers = db.papers;

// Create and Save a new Papers
exports.create = (req, res) => {
  // Validate request
  if (!req.body.title) {
    res.status(400).send({
      message: 'Content can not be empty!',
    });
    return;
  }

  // Create a Papers
  const paperData = {
    title: req.body.title,
    journal: req.body.journal,
    publication: req.body.publication,
    academic_year_id: req.body.academic_year_id,
    professor_id: req.body.professor_id,
  };

  // Save Papers in the database
  Papers.create(paperData)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || 'Some error occurred while creating the Papers.',
      });
    });
};

// Retrieve all Paperss from the database.
exports.findAll = (req, res) => {
  Papers.findAll()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Some error occurred while retrieving Paper.',
      });
    });
};

// Find a single Papers with an id
exports.findOne = (req, res) => {
  const { id } = req.params;

  Papers.findByPk(id)
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find Papers with id=${id}.`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: `Error retrieving Papers with id=${id}`,
      });
    });
};

// Update a Papers by the id in the request
exports.update = (req, res) => {
  const { id } = req.params;

  Papers.update(req.body, {
    where: { id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: 'Papers was updated successfully.',
        });
      } else {
        res.send({
          message: `Cannot update Papers with id=${id}. Maybe Papers was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: `Error updating Papers with id=${id}`,
      });
    });
};

// Delete a Papers with the specified id in the request
exports.delete = (req, res) => {
  const { id } = req.params;

  Papers.destroy({
    where: { id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: 'Papers was deleted successfully!',
        });
      } else {
        res.send({
          message: `Cannot delete Papers with id=${id}. Maybe Papers was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: `Could not delete Papers with id=${id}`,
      });
    });
};

// Delete all Papers from the database.
exports.deleteAll = (req, res) => {
  Papers.destroy({
    where: {},
    truncate: false,
  })
    .then((nums) => {
      res.send({ message: `${nums} Paperss were deleted successfully!` });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || 'Some error occurred while removing all Paperss.',
      });
    });
};

// Find all Papers with a specific academic_year_id
exports.findAllByAcademicYear = (req, res) => {
  const { academic_year_id } = req.params;

  Papers.findAll({ where: { academic_year_id } })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Some error occurred while retrieving Courses.',
      });
    });
};
