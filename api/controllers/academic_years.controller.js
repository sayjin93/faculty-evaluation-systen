const db = require("../models");
const AcademicYears = db.academic_years;

// Create and Save a new Academic Year
exports.create = (req, res) => {
  // Validate request
  if (!req.body.year) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
    return;
  }

  // Create a Academic Year
  const AcademicYearData = {
    year: req.body.year,
    active: req.body.active,
  };

  // Save Academic Year in the database
  AcademicYears.create(AcademicYearData)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "Some error occurred while creating the Academic Year.",
      });
    });
};

// Retrieve all Academic Years from the database.
exports.findAll = (req, res) => {
  AcademicYears.findAll()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Academic Years.",
      });
    });
};

// Find a single Academic Year with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  AcademicYears.findByPk(id)
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find Academic Year with id=${id}.`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving Academic Year with id=" + id,
      });
    });
};

// Update a Academic Year by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  AcademicYears.update(req.body, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Academic Year was updated successfully.",
        });
      } else {
        res.send({
          message: `Cannot update Academic Year with id=${id}. Maybe Academic Year was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating Academic Year with id=" + id,
      });
    });
};

// Update the active property of all Academic Years
exports.updateActiveStatus = (req, res) => {
  const activeId = req.params.id;

  // Set the active property to false for all rows except the specified id
  AcademicYears.update(
    { active: false },
    { where: { id: { [db.Sequelize.Op.ne]: activeId } } }
  )
    .then((num) => {
      if (num > 0) {
        // Set the active property to true for the specified id
        AcademicYears.update({ active: true }, { where: { id: activeId } })
          .then(() => {
            res.send({
              message: "Academic Year active status updated successfully.",
            });
          })
          .catch((err) => {
            res.status(500).send({
              message: "Error updating Academic Year active status.",
            });
          });
      } else {
        res.send({
          message:
            "No Academic Years found to update the active status. Make sure the specified id exists.",
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating Academic Year active status.",
      });
    });
};

// Delete a Academic Year with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  AcademicYears.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Academic Year was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete Academic Year with id=${id}. Maybe Academic Year was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete Academic Year with id=" + id,
      });
    });
};

// Delete all Academic Year from the database.
exports.deleteAll = (req, res) => {
  AcademicYears.destroy({
    where: {},
    truncate: false,
  })
    .then((nums) => {
      res.send({
        message: `${nums} Academic Years were deleted successfully!`,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "Some error occurred while removing all Academic Years.",
      });
    });
};

// Find all published Academic Year
exports.findAllPublished = (req, res) => {
  AcademicYears.findAll({ where: { published: true } })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Academic Years.",
      });
    });
};
