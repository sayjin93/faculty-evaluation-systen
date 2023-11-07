const express = require('express');
const passport = require('passport');

const Professor = require('../models/professor');
const Course = require('../models/course');

const router = express.Router();

const auth = passport.authenticate('jwt', { session: false });

// Create a new Course
router.post('/', auth, async (req, res) => {
  // Validate request
  if (!req.body.name) {
    res.status(400).send({
      message: 'Content can not be empty',
    });
    return;
  }

  // Create a Course
  const courseData = {
    name: req.body.name,
    number: req.body.number,
    semester: req.body.semester,
    week_hours: req.body.week_hours,
    program: req.body.program,
    academic_year_id: req.body.academic_year_id,
    professor_id: req.body.professor_id,
  };

  // Save Course in the database
  Course.create(courseData)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || 'Some error occurred while creating the Course',
      });
    });
});

// Retrieve all Courses
router.get('/', auth, async (req, res) => {
  const result = await Course.findAll().catch((err) => {
    console.log('Error: ', err);
  });

  if (!result) {
    return res.json({
      message: 'Does not exist any Course',
    });
  }

  res.json({ data: result });
});

// Retrieve all Courses with a specific academic_year_id
router.get('/academic_year/:academic_year_id', auth, async (req, res) => {
  const { academic_year_id } = req.params;

  Course.findAll({
    where: { academic_year_id },
    include: [
      {
        model: Professor,
        attributes: ['first_name', 'last_name'], // Specify the attributes you want to retrieve
      },
    ],
  })
    .then((data) => {
      const modifiedData = data.map((course) => ({
        id: course.id,
        name: course.name,
        number: course.number,
        semester: course.semester,
        week_hours: course.week_hours,
        program: course.program,
        academic_year_id: course.academic_year_id,
        professor_id: course.professor_id,
        createdAt: course.createdAt,
        updatedAt: course.updatedAt,
        professor_full_name: `${course.Professor.first_name} ${course.Professor.last_name}`,
      }));

      res.send(modifiedData);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Some error occurred while retrieving Courses',
      });
    });
});

// Retrieve a single Course with id
router.get('/:id', auth, async (req, res) => {
  const { id } = req.params;

  Course.findByPk(id)
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find Course with id=${id}`,
        });
      }
    })
    .catch(() => {
      res.status(500).send({
        message: `Error retrieving Course with id=${id}`,
      });
    });
});

// Update a Course with id
router.put('/:id', auth, async (req, res) => {
  const { id } = req.params;

  Course.update(req.body, {
    where: { id },
  })
    .then((num) => {
      if (Number(num) === 1) {
        res.send({
          message: 'Course was updated successfully',
        });
      } else {
        res.send({
          message: `Cannot update Course with id=${id}. Maybe Course was not found or req.body is empty`,
        });
      }
    })
    .catch(() => {
      res.status(500).send({
        message: `Error updating Course with id=${id}`,
      });
    });
});

// Delete a Course with id
router.delete('/:id', auth, async (req, res) => {
  const { id } = req.params;

  Course.destroy({
    where: { id },
  })
    .then((num) => {
      if (Number(num) === 1) {
        res.send({
          message: 'Course was deleted successfully',
        });
      } else {
        res.send({
          message: `Cannot delete Course with id=${id}. Maybe Course was not found!`,
        });
      }
    })
    .catch(() => {
      res.status(409).send({
        message: `Could not delete Course with id=${id}`,
      });
    });
});

// Delete all Courses
router.delete('/', auth, async (req, res) => {
  Course.destroy({
    where: {},
    truncate: false,
  })
    .then((nums) => {
      res.send({
        message: `${nums} Courses were deleted successfully`,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Some error occurred while removing all Courses',
      });
    });
});

module.exports = router;
