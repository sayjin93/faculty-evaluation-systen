const db = require("../models");
const Conference = db.conference;

// Create and Save a new Conference
exports.create = (req, res) => {
  // Validate request
  if (!req.body.name) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
    return;
  }

  // Create a Conference
  const conferenceData = {
    name: req.body.name,
    location: req.body.location,
    present_title: req.body.present_title,
    autors: req.body.authors,
    dates: req.body.dates,
    scientific_work_id: req.body.scientific_work_id,
  };

  // Save Conference in the database
  Conference.create(conferenceData)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Conference.",
      });
    });
};

// Retrieve all Conferences from the database.
exports.findAll = (req, res) => {
  Conference.findAll()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Conferences.",
      });
    });
};

// Find a single Conference with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Conference.findByPk(id)
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find Conference with id=${id}.`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving Conference with id=" + id,
      });
    });
};

// Update a Conference by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  Conference.update(req.body, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Conference was updated successfully.",
        });
      } else {
        res.send({
          message: `Cannot update Conference with id=${id}. Maybe Conference was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating Conference with id=" + id,
      });
    });
};

// Delete a Conference with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Conference.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Conference was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete Conference with id=${id}. Maybe Conference was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete Conference with id=" + id,
      });
    });
};

// Delete all Conference from the database.
exports.deleteAll = (req, res) => {
  Conference.destroy({
    where: {},
    truncate: false,
  })
    .then((nums) => {
      res.send({ message: `${nums} Conferences were deleted successfully!` });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all Conferences.",
      });
    });
};

// Find all published Conference
exports.findAllPublished = (req, res) => {
  Conference.findAll({ where: { published: true } })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Conferences.",
      });
    });
};
