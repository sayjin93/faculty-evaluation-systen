const express = require('express');
const passport = require('passport');

const Professor = require('../models/professor');

const router = express.Router();

const auth = passport.authenticate('jwt', { session: false });

// Create a new Professor
router.post('/', auth, async (req, res) => {
  // Validate request
  if (!req.body.first_name || !req.body.last_name || !req.body.gender) {
    res.status(400).send({
      message: 'Content can not be empty',
    });
    return;
  }

  const professorData = {
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    gender: req.body.gender,
    is_deleted: req.body.is_deleted,
  };

  // Save Professor in the database
  Professor.create(professorData)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Some error occurred while creating the Professor',
      });
    });
});

// Retrieve all Professors
router.get('/', auth, async (req, res) => {
  const result = await Professor.findAll().catch((err) => {
    console.log('Error: ', err);
  });

  if (!result) {
    return res.json({
      message: 'Does not exist any Professor',
    });
  }

  // Modify gender property in the result array
  const modifiedResult = result.map((professor) => ({
    id: professor.id,
    first_name: professor.first_name,
    last_name: professor.last_name,
    gender: professor.gender === 'm' ? 'Male' : 'Female',
    is_deleted: professor.is_deleted,
    createdAt: professor.createdAt,
    updatedAt: professor.updatedAt,
  }));

  res.send(modifiedResult);
});

// Retrieve all active Professors
router.get('/active', auth, async (req, res) => {
  Professor.findAll({ where: { is_deleted: false } })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Some error occurred while retrieving Professors',
      });
    });
});

// Retrieve a single Professor with id
router.get('/:id', auth, async (req, res) => {
  const { id } = req.params;

  Professor.findByPk(id)
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find Professor with id=${id}`,
        });
      }
    })
    .catch(() => {
      res.status(500).send({
        message: `Error retrieving Professor with id=${id}`,
      });
    });
});

// Update a Professor with id
router.put('/:id', auth, async (req, res) => {
  const { id } = req.params;

  const professorData = {
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    gender: req.body.gender,
    is_deleted: req.body.is_deleted,
  };

  Professor.update(professorData, {
    where: { id },
  })
    .then((num) => {
      if (Number(num) === 1) {
        res.send({
          message: 'Professor was updated successfully',
        });
      } else {
        res.send({
          message: `Cannot update Professor with id=${id}. Maybe Professor was not found or req.body is empty!`,
        });
      }
    })
    .catch(() => {
      res.status(500).send({
        message: `Error updating Professor with id=${id}`,
      });
    });
});

// Delete a Professor with id
router.delete('/:id', auth, async (req, res) => {
  const { id } = req.params;

  Professor.destroy({
    where: { id },
  })
    .then((num) => {
      if (Number(num) === 1) {
        res.send({
          message: 'Professor was deleted successfully',
        });
      } else {
        res.send({
          message: `Cannot delete Professor with id=${id}. Maybe Professor was not found!`,
        });
      }
    })
    .catch(() => {
      res.status(409).send({
        message: `Could not delete Professor with id=${id}`,
      });
    });
});

// Delete all Professors
router.delete('/', auth, async (req, res) => {
  Professor.destroy({
    where: {},
    truncate: false,
  })
    .then((nums) => {
      res.send({
        message: `${nums} Professors were deleted successfully`,
      });
    })
    .catch((err) => {
      if (err.name === 'SequelizeForeignKeyConstraintError') {
        res.status(409).send({
          message: 'Cannot delete professor due to foreign key constraint',
        });
      } else {
        res.status(500).send({
          message: 'Some error occurred while removing all professors',
        });
      }
    });
});

module.exports = router;
