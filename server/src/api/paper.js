const express = require('express');
const passport = require('passport');

const Professor = require('../models/professor');
const Paper = require('../models/paper');

const router = express.Router();

const auth = passport.authenticate('jwt', { session: false });

// Create a new Paper
router.post('/', auth, async (req, res) => {
  // Validate request
  if (!req.body.title) {
    res.status(400).send({
      message: 'Content can not be empty',
    });
    return;
  }

  // Create a Paper
  const paperData = {
    title: req.body.title,
    journal: req.body.journal,
    publication: req.body.publication,
    academic_year_id: req.body.academic_year_id,
    professor_id: req.body.professor_id,
  };

  // Save Paper in the database
  Paper.create(paperData)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || 'Some error occurred while creating the Paper',
      });
    });
});

// Retrieve all Papers
router.get('/', auth, async (req, res) => {
  const result = await Paper.findAll().catch((err) => {
    console.log('Error: ', err);
  });

  if (!result) {
    return res.json({
      message: 'Does not exist any Paper',
    });
  }

  res.json(result);
});

// Retrieve all Papers with a specific academic_year_id
router.get('/academic_year/:academic_year_id', auth, async (req, res) => {
  const { academic_year_id } = req.params;

  Paper.findAll({
    where: { academic_year_id },
    include: [
      {
        model: Professor,
        attributes: ['first_name', 'last_name'], // Specify the attributes you want to retrieve
      },
    ],
  })
    .then((data) => {
      const modifiedData = data.map((paper) => ({
        id: paper.id,
        title: paper.title,
        journal: paper.journal,
        publication: paper.publication,
        academic_year_id: paper.academic_year_id,
        professor_id: paper.professor_id,
        createdAt: paper.createdAt,
        updatedAt: paper.updatedAt,
        professor_full_name: `${paper.Professor.first_name} ${paper.Professor.last_name}`,
      }));

      res.send(modifiedData);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Some error occurred while retrieving Papers',
      });
    });
});

// Retrieve a single Paper with id
router.get('/:id', auth, async (req, res) => {
  const { id } = req.params;

  Paper.findByPk(id)
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find Paper with id=${id}`,
        });
      }
    })
    .catch(() => {
      res.status(500).send({
        message: `Error retrieving Paper with id=${id}`,
      });
    });
});

// Update a Paper with id
router.put('/:id', auth, async (req, res) => {
  const { id } = req.params;

  Paper.update(req.body, {
    where: { id },
  })
    .then((num) => {
      if (Number(num) === 1) {
        res.send({
          message: 'Paper was updated successfully',
        });
      } else {
        res.send({
          message: `Cannot update Paper with id=${id}. Maybe Paper was not found or req.body is empty!`,
        });
      }
    })
    .catch(() => {
      res.status(500).send({
        message: `Error updating Paper with id=${id}`,
      });
    });
});

// Delete a Paper with id
router.delete('/:id', auth, async (req, res) => {
  const { id } = req.params;

  Paper.destroy({
    where: { id },
  })
    .then((num) => {
      if (Number(num) === 1) {
        res.send({
          message: 'Paper was deleted successfully',
        });
      } else {
        res.send({
          message: `Cannot delete Paper with id=${id}. Maybe Paper was not found!`,
        });
      }
    })
    .catch(() => {
      res.status(409).send({
        message: `Could not delete Paper with id=${id}`,
      });
    });
});

// Delete all Papers
router.delete('/', auth, async (req, res) => {
  Paper.destroy({
    where: {},
    truncate: false,
  })
    .then((nums) => {
      res.send({
        message: `${nums} Papers were deleted successfully`,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Some error occurred while removing all Papers',
      });
    });
});

module.exports = router;
