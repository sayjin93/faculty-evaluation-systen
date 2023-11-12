const express = require('express');
const passport = require('passport');

const Faculty = require('../models/faculty');

const router = express.Router();

const auth = passport.authenticate('jwt', { session: false });

// Create a new Faculty
router.post('/', auth, async (req, res) => {
  // Validate request
  if (!req.body.key) {
    res.status(400).send({
      message: 'Content can not be empty',
    });
    return;
  }

  // Create a Faculty
  const FacultyData = {
    key: req.body.key,
  };

  // Save Faculty in the database
  Faculty.create(FacultyData)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || 'Some error occurred while creating the Faculty',
      });
    });
});

// Retrieve all Faculties
router.get('/', async (req, res) => {
  const result = await Faculty.findAll().catch((err) => {
    console.log('Error: ', err);
  });

  if (!result) {
    return res.json({
      message: 'Does not exist any Faculty',
    });
  }

  res.json(result);
});

// Retrieve a single Faculty with id
router.get('/:id', auth, async (req, res) => {
  const { id } = req.params;

  Faculty.findByPk(id)
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find Faculty with id=${id}`,
        });
      }
    })
    .catch(() => {
      res.status(500).send({
        message: `Error retrieving Faculty with id=${id}`,
      });
    });
});

// Update a Faculty with id
router.put('/:id', auth, async (req, res) => {
  const { id } = req.params;

  Faculty.update(req.body, {
    where: { id },
  })
    .then((num) => {
      if (Number(num) === 1) {
        res.send({
          message: 'Faculty was updated successfully',
        });
      } else {
        res.send({
          message: `Cannot update Faculty with id=${id}. Maybe Faculty was not found or req.body is empty!`,
        });
      }
    })
    .catch(() => {
      res.status(500).send({
        message: `Error updating Faculty with id=${id}`,
      });
    });
});

// Delete a Faculty with id
router.delete('/:id', auth, async (req, res) => {
  const { id } = req.params;

  Faculty.destroy({
    where: { id },
  })
    .then((num) => {
      if (Number(num) === 1) {
        res.send({
          message: 'Faculty was deleted successfully',
        });
      } else {
        res.send({
          message: `Cannot delete Faculty with id=${id}. Maybe Faculty was not found!`,
        });
      }
    })
    .catch(() => {
      res.status(409).send({
        message: `Could not delete Faculty with id=${id}`,
      });
    });
});

// Delete all Facultys
router.delete('/', auth, async (req, res) => {
  Faculty.destroy({
    where: {},
    truncate: false,
  })
    .then((nums) => {
      res.send({
        message: `${nums} Facultys were deleted successfully`,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Some error occurred while removing all Facultys',
      });
    });
});

module.exports = router;
