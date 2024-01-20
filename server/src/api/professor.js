const express = require('express');
const bcrypt = require('bcrypt');
const passport = require('passport');

const router = express.Router();
const auth = passport.authenticate('jwt', { session: false });

const Professor = require('../models/professor'); // Professor Model

const { capitalizeWords, lowercaseNoSpace } = require('../utils'); // Utils

// Create a new Professor
router.post('/', auth, async (req, res) => {
  const {
    first_name, last_name, gender, username, email,
  } = req.body;

  // Validate request
  if (!first_name || !last_name || !gender || !username || !email) {
    res.status(400).send({
      message: 'Content can not be empty',
    });
    return;
  }

  const new_first_name = capitalizeWords(first_name);
  const new_last_name = capitalizeWords(last_name);
  const new_username = lowercaseNoSpace(username);
  const new_email = lowercaseNoSpace(email);

  const professorData = {
    first_name: new_first_name,
    last_name: new_last_name,
    gender: req.body.gender,
    username: new_username,
    email: new_email,
    is_verified: 1,
    is_deleted: 0,
    is_admin: 0,
  };

  // Save Professor in the database
  await Professor.create(professorData)
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
  const result = await Professor.findAll({ where: { is_admin: false } }).catch((err) => {
    console.log('Error: ', err);
  });

  if (!result) {
    return res.json({
      message: 'No Professors found',
    });
  }

  // Modify gender property in the result array
  const modifiedResult = result.map((professor) => ({
    id: professor.id,
    first_name: professor.first_name,
    last_name: professor.last_name,
    gender: professor.gender === 'm' ? 'Male' : 'Female',
    username: professor.username,
    email: professor.email,
    is_verified: professor.is_verified,
    is_deleted: professor.is_deleted,
    createdAt: professor.createdAt,
    updatedAt: professor.updatedAt,
  }));

  res.send(modifiedResult);
});

// Retrieve a single Professor with id
router.get('/:id', auth, async (req, res) => {
  const { id } = req.params;

  await Professor.findByPk(id)
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
router.put('/:id', auth, (req, res) => {
  const { id } = req.params;
  const {
    first_name, last_name, gender, username, currentPassword, newPassword,
  } = req.body;

  const new_first_name = capitalizeWords(first_name);
  const new_last_name = capitalizeWords(last_name);
  const new_username = lowercaseNoSpace(username);

  // Fetch the user
  Professor.findByPk(id)
    .then((user) => {
      if (!user) {
        res.status(404).send({
          message: 'User not found!',
        });
        return;
      }

      // Check if current password is correct
      bcrypt.compare(currentPassword, user.password, async (err, result) => {
        if (err) {
          res.status(500).send({
            message: 'Internal server error.',
          });
          return;
        }

        // If the current password is not correct, return an error message
        if (!result) {
          res.status(401).send({
            message: 'Current password is not correct',
          });
          return;
        }

        // Prepare the update object
        const updateObject = {
          first_name: new_first_name,
          last_name: new_last_name,
          gender,
          username: new_username,
        };

        // Check if newPassword is provided
        if (newPassword) {
          updateObject.password = newPassword;
        }

        // Update the Professor
        Professor.update(updateObject, { where: { id } })
          .then((num) => {
            if (Number(num) === 1) {
              // Fetch updated user data
              Professor.findByPk(id, {
                attributes: [
                  'first_name',
                  'last_name',
                  'gender',
                  'username',
                  'email',
                ],
              }).then((updatedUser) => {
                res.send(updatedUser);
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
    })
    .catch(() => {
      res.status(500).send({
        message: `Error retrieving Professor with id=${id}`,
      });
    });
});

// Delete a Professor with id
router.delete('/:id', auth, async (req, res) => {
  const { id } = req.params;

  await Professor.destroy({
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
  await Professor.destroy({
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
