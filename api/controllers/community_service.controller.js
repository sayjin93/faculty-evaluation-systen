const db = require("../models");
const CommunityService = db.community_service;

// Create and Save a new Community Service
exports.create = (req, res) => {
  // Validate request
  if (!req.body.event) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
    return;
  }

  // Create a Tutorial
  const CommunityServiceData = {
    event: req.body.year,
    time: req.body.active,
    description: req.body.description,
    external: req.body.external,
    academic_year_id: req.body.academic_year_id,
    preofessor_id: req.body.preofessor_id,
  };

  // Save Tutorial in the database
  CommunityService.create(CommunityServiceData)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "Some error occurred while creating the Community Service.",
      });
    });
};

// Retrieve all Community Services from the database.
exports.findAll = (req, res) => {
  CommunityService.findAll()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "Some error occurred while retrieving Community Services.",
      });
    });
};

// Find a single Community Service with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  CommunityService.findByPk(id)
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find Community Service with id=${id}.`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving Community Service with id=" + id,
      });
    });
};

// Update a Community Service by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  CommunityService.update(req.body, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Community Service was updated successfully.",
        });
      } else {
        res.send({
          message: `Cannot update Community Service with id=${id}. Maybe Community Service was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating Community Service with id=" + id,
      });
    });
};

// Delete a Community Service with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  CommunityService.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Community Service was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete Community Service with id=${id}. Maybe Community Service was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete Community Service with id=" + id,
      });
    });
};

// Delete all Community Service from the database.
exports.deleteAll = (req, res) => {
  CommunityService.destroy({
    where: {},
    truncate: false,
  })
    .then((nums) => {
      res.send({
        message: `${nums} Community Services were deleted successfully!`,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "Some error occurred while removing all Community Services.",
      });
    });
};

// Find all published Community Service
exports.findAllPublished = (req, res) => {
  Tutorial.findAll({ where: { published: true } })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "Some error occurred while retrieving Community Services.",
      });
    });
};
