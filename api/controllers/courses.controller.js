const db = require("../models");
const Courses = db.courses;

// Create and Save a new Courses
exports.create = (req, res) => {
  // Validate request
  if (!req.body.name) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
    return;
  }

  // Create a Courses
  const courseData = {
    name: req.body.name,
    number: req.body.number,
    semester: req.body.semester,
    week_hours: req.body.week_hours,
    program: req.body.program,
    academic_year_id: req.body.academic_year_id,
    professor_id: req.body.professor_id,
  };

  // Save Courses in the database
  Courses.create(courseData)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Courses.",
      });
    });
};

// Retrieve all Coursess from the database.
exports.findAll = (req, res) => {
  Courses.findAll()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving Course.",
      });
    });
};

// Find a single Courses with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Courses.findByPk(id)
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find Courses with id=${id}.`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving Courses with id=" + id,
      });
    });
};

// Update a Courses by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  Courses.update(req.body, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Courses was updated successfully.",
        });
      } else {
        res.send({
          message: `Cannot update Courses with id=${id}. Maybe Courses was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating Courses with id=" + id,
      });
    });
};

// Delete a Courses with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Courses.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Courses was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete Courses with id=${id}. Maybe Courses was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete Courses with id=" + id,
      });
    });
};

// Delete all Courses from the database.
exports.deleteAll = (req, res) => {
  Courses.destroy({
    where: {},
    truncate: false,
  })
    .then((nums) => {
      res.send({ message: `${nums} Coursess were deleted successfully!` });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all Coursess.",
      });
    });
};

// Find all published Courses
exports.findAllPublished = (req, res) => {
  Courses.findAll({ where: { published: true } })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving Coursess.",
      });
    });
};
