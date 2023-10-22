const db = require('../models');

const Professors = db.professors;

// Create and Save a new Professors
exports.create = (req, res) => {
  // Validate request
  if (!req.body.firstname) {
    res.status(400).send({
      message: 'Content can not be empty!',
    });
    return;
  }

  const professorData = {
    first_name: req.body.firstname,
    last_name: req.body.lastname,
    gender: req.body.gender,
  };

  // Save Professot in the database
  Professors.create(professorData)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || 'Some error occurred while creating the Professor.',
      });
    });
};

// Retrieve all Professorss from the database.
exports.findAll = (req, res) => {
  Professors.findAll()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || 'Some error occurred while retrieving professorss.',
      });
    });
};

// Find a single Professor with an id
exports.findOne = (req, res) => {
  const { id } = req.params;

  Professors.findByPk(id)
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find Professors with id=${id}.`,
        });
      }
    })
    .catch(() => {
      res.status(500).send({
        message: `Error retrieving Professors with id=${id}`,
      });
    });
};

// Update a Professor by the id in the request
exports.update = (req, res) => {
  const { id } = req.params;

  const professorData = {
    first_name: req.body.firstname,
    last_name: req.body.lastname,
    gender: req.body.gender,
  };

  Professors.update(professorData, {
    where: { id },
  })
    .then((num) => {
      if (num === 1) {
        res.send({
          message: 'Professors was updated successfully.',
        });
      } else {
        res.send({
          message: `Cannot update Professors with id=${id}. Maybe Professors was not found or req.body is empty!`,
        });
      }
    })
    .catch(() => {
      res.status(500).send({
        message: `Error updating Professors with id=${id}`,
      });
    });
};

// Delete a Professor with the specified id in the request
exports.delete = (req, res) => {
  const { id } = req.params;
  Professors.destroy({
    where: { id },
  })
    .then((num) => {
      if (num === 1) {
        res.send({
          message: 'Professors was deleted successfully!',
        });
      } else {
        res.send({
          message: `Could not delete Professors with id=${id}. Maybe Professors was not found!`,
        });
      }
    })
    .catch((err) => {
      if (err.name === 'SequelizeForeignKeyConstraintError') {
        res.status(409).send({
          message: `Cannot delete the Professor with id=${id} due to foreign key constraint.`,
        });
      } else {
        res.status(500).send({
          message: `Could not delete Professor with id=${id}`,
        });
      }
    });
};

// Delete all Professors from the database.
exports.deleteAll = (req, res) => {
  Professors.destroy({
    where: {},
    truncate: false,
  })
    .then((nums) => {
      res.send({ message: `${nums} Professors were deleted successfully!` });
    })
    .catch((err) => {
      if (err.name === 'SequelizeForeignKeyConstraintError') {
        res.status(409).send({
          message: 'Cannot delete professor due to foreign key constraint.',
        });
      } else {
        res.status(500).send({
          message: 'Some error occurred while removing all professors.',
        });
      }
    });
};

// Find all published Professors
exports.findAllPublished = (req, res) => {
  Professors.findAll({ where: { published: true } })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || 'Some error occurred while retrieving professorss.',
      });
    });
};
