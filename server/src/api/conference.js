const express = require('express');
const passport = require('passport');

const Conference = require('../models/conference');

const router = express.Router();

const auth = passport.authenticate('jwt', { session: false });

// Create a new Conference
router.post('/', auth, async (req, res) => {
  // Validate request
  if (!req.body.name) {
    res.status(400).send({
      message: 'Content can not be empty',
    });
    return;
  }

  // Create a Conference
  const conferenceData = {
    name: req.body.name,
    location: req.body.location,
    present_title: req.body.present_title,
    authors: req.body.authors,
    dates: req.body.dates,
    academic_year_id: req.body.academic_year_id,
    professor_id: req.body.professor_id,
  };

  // Save Conference in the database
  Conference.create(conferenceData)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || 'Some error occurred while creating the Conference',
      });
    });
});

// Retrieve all Conferences
router.get('/', auth, async (req, res) => {
  const result = await Conference.findAll().catch((err) => {
    console.log('Error: ', err);
  });

  if (!result) {
    return res.json({
      message: 'Does not exist any Conference',
    });
  }

  res.json({ data: result });
});

// Retrieve all Conferences with a specific academic_year_id
router.get('/academic_year/:academic_year_id', auth, async (req, res) => {
  const { academic_year_id } = req.params;

  Conference.findAll({ where: { academic_year_id } })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Some error occurred while retrieving Conferences',
      });
    });
});

// Retrieve a single Conference with id
router.get('/:id', auth, async (req, res) => {
  const { id } = req.params;

  Conference.findByPk(id)
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find Conference with id=${id}`,
        });
      }
    })
    .catch(() => {
      res.status(500).send({
        message: `Error retrieving Conference with id=${id}`,
      });
    });
});

// Update a Conference with id
router.put('/:id', auth, async (req, res) => {
  const { id } = req.params;

  Conference.update(req.body, {
    where: { id },
  })
    .then((num) => {
      if (Number(num) === 1) {
        res.send({
          message: 'Conference was updated successfully',
        });
      } else {
        res.send({
          message: `Cannot update Conference with id=${id}. Maybe Conference was not found or req.body is empty!`,
        });
      }
    })
    .catch(() => {
      res.status(500).send({
        message: `Error updating Conference with id=${id}`,
      });
    });
});

// Delete a Conference with id
router.delete('/:id', auth, async (req, res) => {
  const { id } = req.params;

  Conference.destroy({
    where: { id },
  })
    .then((num) => {
      if (Number(num) === 1) {
        res.send({
          message: 'Conference was deleted successfully',
        });
      } else {
        res.send({
          message: `Cannot delete Conference with id=${id}. Maybe Conference was not found!`,
        });
      }
    })
    .catch(() => {
      res.status(409).send({
        message: `Could not delete Conference with id=${id}`,
      });
    });
});

// Delete all Conferences
router.delete('/', auth, async (req, res) => {
  Conference.destroy({
    where: {},
    truncate: false,
  })
    .then((nums) => {
      res.send({
        message: `${nums} Conferences were deleted successfully`,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Some error occurred while removing all Conferences',
      });
    });
});

module.exports = router;
