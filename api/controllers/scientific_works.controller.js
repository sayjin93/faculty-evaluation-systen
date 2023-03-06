const db = require("../models");
const ScientificWorks = db.scientific_works;

// Create and Save a new Scientific Work
exports.create = (req, res) => {
  // Validate request
  if (!req.body.professor_id) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
    return;
  }

  // Create a Scientific Work
  const scientific_workData = {
    academic_year_id: req.body.journal,
    professor_id: req.body.publication,
  };

  // Save Scientific Work in the database
  ScientificWorks.create(scientific_workData)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "Some error occurred while creating the Scientific Work.",
      });
    });
};

// Retrieve all Scientific Works from the database.
exports.findAll = (req, res) => {
  ScientificWorks.findAll()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "Some error occurred while retrieving Scientific Works.",
      });
    });
};

// Find a single Scientific Work with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  ScientificWorks.findByPk(id)
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find Scientific Work with id=${id}.`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving Scientific Work with id=" + id,
      });
    });
};

// Update a Scientific Work by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  ScientificWorks.update(req.body, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Scientific Work was updated successfully.",
        });
      } else {
        res.send({
          message: `Cannot update Scientific Work with id=${id}. Maybe Scientific Work was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating Scientific Work with id=" + id,
      });
    });
};

// Delete a Scientific Work with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  ScientificWorks.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Scientific Work was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete Scientific Work with id=${id}. Maybe Scientific Work was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete Scientific Work with id=" + id,
      });
    });
};

// Delete all Scientific Work from the database.
exports.deleteAll = (req, res) => {
  ScientificWorks.destroy({
    where: {},
    truncate: false,
  })
    .then((nums) => {
      res.send({
        message: `${nums} Scientific Works were deleted successfully!`,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "Some error occurred while removing all Scientific Works.",
      });
    });
};

// Find all published Scientific Work
exports.findAllPublished = (req, res) => {
  ScientificWorks.findAll({ where: { published: true } })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "Some error occurred while retrieving Scientific Works.",
      });
    });
};
