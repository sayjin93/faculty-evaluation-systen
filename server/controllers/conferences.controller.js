const db = require('../models');

const Conferences = db.conferences;

// Create and Save a new Conferences
exports.create = (req, res) => {
  // Validate request
  if (!req.body.name) {
    res.status(400).send({
      message: 'Content can not be empty!',
    });
    return;
  }

  // Create a Conferences
  const conferenceData = {
    name: req.body.name,
    location: req.body.location,
    present_title: req.body.present_title,
    authors: req.body.authors,
    dates: req.body.dates,
    academic_year_id: req.body.academic_year_id,
    professor_id: req.body.professor_id,
  };

  // Save Conferences in the database
  Conferences.create(conferenceData)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || 'Some error occurred while creating the Conference.',
      });
    });
};

// Retrieve all Conferencess from the database.
exports.findAll = (req, res) => {
  Conferences.findAll()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || 'Some error occurred while retrieving Conferencess.',
      });
    });
};

// Find a single Conferences with an id
exports.findOne = (req, res) => {
  const { id } = req.params;

  Conferences.findByPk(id)
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find Conferences with id=${id}.`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: `Error retrieving Conferences with id=${id}`,
      });
    });
};

// Update a Conferences by the id in the request
exports.update = (req, res) => {
  const { id } = req.params;

  Conferences.update(req.body, {
    where: { id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: 'Conferences was updated successfully.',
        });
      } else {
        res.send({
          message: `Cannot update Conferences with id=${id}. Maybe Conferences was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: `Error updating Conferences with id=${id}`,
      });
    });
};

// Delete a Conferences with the specified id in the request
exports.delete = (req, res) => {
  const { id } = req.params;

  Conferences.destroy({
    where: { id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: 'Conferences was deleted successfully!',
        });
      } else {
        res.send({
          message: `Cannot delete Conferences with id=${id}. Maybe Conferences was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: `Could not delete Conferences with id=${id}`,
      });
    });
};

// Delete all Conferences from the database.
exports.deleteAll = (req, res) => {
  Conferences.destroy({
    where: {},
    truncate: false,
  })
    .then((nums) => {
      res.send({ message: `${nums} Conferencess were deleted successfully!` });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || 'Some error occurred while removing all Conferencess.',
      });
    });
};

// Find all Conferences with a specific academic_year_id
exports.findAllByAcademicYear = (req, res) => {
  const { academic_year_id } = req.params;

  Conferences.findAll({ where: { academic_year_id } })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Some error occurred while retrieving Courses.',
      });
    });
};
