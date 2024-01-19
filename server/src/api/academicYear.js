const express = require('express');
const passport = require('passport');
const Sequelize = require('sequelize');

const AcademicYear = require('../models/academicYear');

const router = express.Router();

const auth = passport.authenticate('jwt', { session: false });

// Create a new Academic Year
router.post('/', auth, async (req, res) => {
  // Validate request
  if (!req.body.year) {
    res.status(400).send({
      message: 'Content can not be empty!',
    });
    return;
  }

  // Create a Academic Year
  const AcademicYearData = {
    year: req.body.year,
    active: req.body.active,
  };

  // Save Academic Year in the database
  await AcademicYear.create(AcademicYearData)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message
          || 'Some error occurred while creating the Academic Year.',
      });
    });
});

// Retrieve all Academic Years
router.get('/', auth, async (req, res) => {
  const result = await AcademicYear.findAll().catch((err) => {
    console.log('Error: ', err);
  });

  if (!result) {
    return res.json({
      message: 'Does not exist any Academic Year!',
    });
  }

  res.json(result);
});

// Retrieve all published Academic Years
router.get('/active', auth, async (req, res) => {
  await AcademicYear.findAll({ where: { active: true } })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || 'Some error occurred while retrieving active Academic Years.',
      });
    });
});

// Retrieve a single Academic Year with id
router.get('/:id', auth, async (req, res) => {
  const { id } = req.params;

  await AcademicYear.findByPk(id)
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find Academic Year with id=${id}.`,
        });
      }
    })
    .catch(() => {
      res.status(500).send({
        message: `Error retrieving Academic Year with id=${id}`,
      });
    });
});

// Update a Academic Year with id
router.put('/:id', auth, async (req, res) => {
  const { id } = req.params;

  await AcademicYear.update(req.body, {
    where: { id },
  })
    .then((num) => {
      if (Number(num) === 1) {
        res.send({
          message: 'Academic Year was updated successfully.',
        });
      } else {
        res.send({
          message: `Cannot update Academic Year with id=${id}. Maybe Academic Year was not found or req.body is empty!`,
        });
      }
    })
    .catch(() => {
      res.status(500).send({
        message: `Error updating Academic Year with id=${id}`,
      });
    });
});

// Update the active status of academic years
router.put('/active/:id', auth, async (req, res) => {
  const activeId = req.params.id;

  // Set the active property to false for all rows except the specified id
  await AcademicYear.update(
    { active: false },
    { where: { id: { [Sequelize.Op.ne]: activeId } } },
  )
    .then(async (num) => {
      if (Number(num) > 0) {
        // Set the active property to true for the specified id
        await AcademicYear.update({ active: true }, { where: { id: activeId } })
          .then(() => {
            res.send({
              message: 'Academic Year active status updated successfully.',
            });
          })
          .catch(() => {
            res.status(500).send({
              message: 'Error updating Academic Year active status.',
            });
          });
      } else {
        res.send({
          message:
            'No Academic Years found to update the active status. Make sure the specified id exists.',
        });
      }
    })
    .catch(() => {
      res.status(500).send({
        message: 'Error updating Academic Year active status.',
      });
    });
});

// Delete a Academic Year with id
router.delete('/:id', auth, async (req, res) => {
  const { id } = req.params;

  await AcademicYear.destroy({
    where: { id },
  })
    .then((num) => {
      if (Number(num) === 1) {
        res.send({
          message: 'Academic Year was deleted successfully!',
        });
      } else {
        res.send({
          message: `Cannot delete Academic Year with id=${id}. Maybe Academic Year was not found!`,
        });
      }
    })
    .catch(() => {
      res.status(409).send({
        message: `Could not delete Academic Year with id=${id}`,
      });
    });
});

// Delete all Academic Years
router.delete('/', auth, async (req, res) => {
  await AcademicYear.destroy({
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
          err.message
          || 'Some error occurred while removing all Academic Years.',
      });
    });
});

module.exports = router;
