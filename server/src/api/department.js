const express = require('express');
const passport = require('passport');

const Faculty = require('../models/faculty');
const Department = require('../models/department');

const router = express.Router();

const auth = passport.authenticate('jwt', { session: false });

// Create a new Department
router.post('/', auth, async (req, res) => {
  // Validate request
  if (!req.body.key || !req.body.faculty_id) {
    res.status(400).send({
      message: 'Content can not be empty',
    });
    return;
  }

  // Create a Department
  const DepartmentData = {
    key: req.body.key,
    faculty_id: req.body.faculty_id,
  };

  // Save Department in the database
  Department.create(DepartmentData)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || 'Some error occurred while creating the Department',
      });
    });
});

// Retrieve all Departments with associated Faculty information
router.get('/', auth, async (req, res) => {
  try {
    const results = await Department.findAll({
      include: [{
        model: Faculty,
        attributes: ['key'],
      }],
    });

    if (!results || results.length === 0) {
      return res.json({
        message: 'No Departments found',
      });
    }

    // Map the results to the desired format
    const modifiedResult = results.map((result) => ({
      id: result.id,
      key: result.key,
      faculty_id: result.faculty_id,
      faculty_key: result.Faculty ? result.Faculty.key : '',
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
    }));

    res.send(modifiedResult);
  } catch (err) {
    console.log('Error: ', err);
    res.status(500).json({
      message: 'Internal Server Error',
    });
  }
});

// Retrieve all Departments of a Faculty
router.get('/faculty/:faculty_id', async (req, res) => {
  const { faculty_id } = req.params;
  Department.findAll({ where: { faculty_id } })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || 'Some error occurred while retrieving Departments.',
      });
    });
});

// Retrieve a single Department with id
router.get('/:id', auth, async (req, res) => {
  const { id } = req.params;

  Department.findByPk(id)
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find Department with id=${id}`,
        });
      }
    })
    .catch(() => {
      res.status(500).send({
        message: `Error retrieving Department with id=${id}`,
      });
    });
});

// Update a Department with id
router.put('/:id', auth, async (req, res) => {
  const { id } = req.params;

  Department.update(req.body, {
    where: { id },
  })
    .then((num) => {
      if (Number(num) === 1) {
        res.send({
          message: 'Department was updated successfully',
        });
      } else {
        res.send({
          message: `Cannot update Department with id=${id}. Maybe Department was not found or req.body is empty!`,
        });
      }
    })
    .catch(() => {
      res.status(500).send({
        message: `Error updating Department with id=${id}`,
      });
    });
});

// Delete a Department with id
router.delete('/:id', auth, async (req, res) => {
  const { id } = req.params;

  Department.destroy({
    where: { id },
  })
    .then((num) => {
      if (Number(num) === 1) {
        res.send({
          message: 'Department was deleted successfully',
        });
      } else {
        res.send({
          message: `Cannot delete Department with id=${id}. Maybe Department was not found!`,
        });
      }
    })
    .catch(() => {
      res.status(409).send({
        message: `Could not delete Department with id=${id}`,
      });
    });
});

// Delete all Departments
router.delete('/', auth, async (req, res) => {
  Department.destroy({
    where: {},
    truncate: false,
  })
    .then((nums) => {
      res.send({
        message: `${nums} Departments were deleted successfully`,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Some error occurred while removing all Departments',
      });
    });
});

module.exports = router;
