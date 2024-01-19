const express = require('express');
const passport = require('passport');

const Professor = require('../models/professor');
const Community = require('../models/community');

const router = express.Router();

const auth = passport.authenticate('jwt', { session: false });

// Create a new Community Service
router.post('/', auth, async (req, res) => {
  // Validate request
  if (!req.body.event) {
    res.status(400).send({
      message: 'Content can not be empty',
    });
    return;
  }

  // Create a Community Service
  const CommunityServiceData = {
    event: req.body.event,
    date: req.body.date || new Date(),
    description: req.body.description,
    external: req.body.external,
    academic_year_id: req.body.academic_year_id,
    professor_id: req.body.professor_id,
  };

  // Save Community Service in the database
  await Community.create(CommunityServiceData)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message
          || 'Some error occurred while creating the Community Service',
      });
    });
});

// Retrieve all Community Services
router.get('/', auth, async (req, res) => {
  const result = await Community.findAll().catch((err) => {
    console.log('Error: ', err);
  });

  if (!result) {
    return res.json({
      message: 'Does not exist any Community Service',
    });
  }

  res.json(result);
});

// Retrieve all Community Services with a specific academic_year_id
router.get('/academic_year/:academic_year_id', auth, async (req, res) => {
  const { academic_year_id } = req.params;

  await Community.findAll({
    where: { academic_year_id },
    include: [
      {
        model: Professor,
        attributes: ['first_name', 'last_name'], // Specify the attributes you want to retrieve
      },
    ],
  })
    .then((data) => {
      const modifiedData = data.map((community) => ({
        id: community.id,
        date: community.date,
        event: community.event,
        description: community.description,
        external: community.external,
        academic_year_id: community.academic_year_id,
        professor_id: community.professor_id,
        createdAt: community.createdAt,
        updatedAt: community.updatedAt,
        professor_full_name: `${community.Professor.first_name} ${community.Professor.last_name}`,
      }));

      res.send(modifiedData);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Some error occurred while retrieving Community Services',
      });
    });
});

// Retrieve a single Community Service with id
router.get('/:id', auth, async (req, res) => {
  const { id } = req.params;

  await Community.findByPk(id)
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find Community Service with id=${id}`,
        });
      }
    })
    .catch(() => {
      res.status(500).send({
        message: `Error retrieving Community Service with id=${id}`,
      });
    });
});

// Update a Community Service with id
router.put('/:id', auth, async (req, res) => {
  const { id } = req.params;

  await Community.update(req.body, {
    where: { id },
  })
    .then((num) => {
      if (Number(num) === 1) {
        res.send({
          message: 'Community Service was updated successfully',
        });
      } else {
        res.send({
          message: `Cannot update Community Service with id=${id}. Maybe Community Service was not found or req.body is empty!`,
        });
      }
    })
    .catch(() => {
      res.status(500).send({
        message: `Error updating Community Service with id=${id}`,
      });
    });
});

// Delete a Community Service with id
router.delete('/:id', auth, async (req, res) => {
  const { id } = req.params;

  await Community.destroy({
    where: { id },
  })
    .then((num) => {
      if (Number(num) === 1) {
        res.send({
          message: 'Community Service was deleted successfully',
        });
      } else {
        res.send({
          message: `Cannot delete Community Service with id=${id}. Maybe Community Service was not found!`,
        });
      }
    })
    .catch(() => {
      res.status(409).send({
        message: `Could not delete Community Service with id=${id}`,
      });
    });
});

// Delete all Community Services
router.delete('/', auth, async (req, res) => {
  await Community.destroy({
    where: {},
    truncate: false,
  })
    .then((nums) => {
      res.send({
        message: `${nums} Community Services were deleted successfully`,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Some error occurred while removing all Community Services',
      });
    });
});

module.exports = router;
