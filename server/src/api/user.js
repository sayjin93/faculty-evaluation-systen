const express = require('express');
const bcrypt = require('bcrypt');
const { Op } = require('sequelize');
const passport = require('passport');

const User = require('../models/user');

const router = express.Router();

const auth = passport.authenticate('jwt', { session: false });

// Retrieve all Users
router.get('/', auth, async (req, res) => {
  const result = await User.findAll().catch((err) => {
    console.log('Error: ', err);
  });

  if (!result) {
    return res.json({
      message: 'Does not exist any User!',
    });
  }

  res.json({ data: result });
});

// Retrieve User with a specific username
router.get('/username/:username', auth, async (req, res) => {
  const { username } = req.params;

  User.findAll({ where: { username } })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Some error occurred while retrieving Courses.',
      });
    });
});

// Retrieve a single User with id
router.get('/:id', auth, async (req, res) => {
  const { id } = req.params;

  User.findByPk(id)
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find User with id=${id}.`,
        });
      }
    })
    .catch(() => {
      res.status(500).send({
        message: `Error retrieving User with id=${id}`,
      });
    });
});

// Update a User with id
router.put('/:id', auth, async (req, res) => {
  const { id } = req.params;
  const {
    first_name, last_name, username, email, currentPassword, newPassword,
  } = req.body;

  // Fetch the user
  User.findByPk(id)
    .then((user) => {
      if (!user) {
        res.status(404).send({
          message: 'User not found!',
        });
        return;
      }

      // Check if current password is correct
      bcrypt.compare(currentPassword, user.password, (err, result) => {
        if (err) {
          res.status(500).send({
            message: 'Internal server error.',
          });
          return;
        }

        // If the current password is not correct, return an error message
        if (!result) {
          res.status(401).send({
            message: 'Current password is not correct.',
          });
          return;
        }

        // Check if the new username or email already exists
        User.findOne({
          where: {
            [Op.or]: [{ username }, { email }],
            [Op.not]: { id },
          },
        })
          .then((existingUser) => {
            if (existingUser) {
              res.status(400).send({
                message: 'Email or Username already exists!',
              });
              return;
            }

            // Update the user
            // const hashedPassword = bcrypt.hashSync(newPassword, 10);
            User.update(
              {
                first_name,
                last_name,
                username,
                email,
                password: newPassword,
              },
              { where: { id } },
            )
              .then((num) => {
                if (Number(num) === 1) {
                  // Fetch updated user data
                  User.findByPk(id, {
                    attributes: [
                      'first_name',
                      'last_name',
                      'username',
                      'email',
                    ],
                  }).then((updatedUser) => {
                    res.send(updatedUser);
                  });
                } else {
                  res.send({
                    message: `Cannot update User with id=${id}. Maybe User was not found or req.body is empty!`,
                  });
                }
              })
              .catch(() => {
                res.status(500).send({
                  message: `Error updating User with id=${id}`,
                });
              });
          })
          .catch(() => {
            res.status(500).send({
              message: 'Internal server error.',
            });
          });
      });
    })
    .catch(() => {
      res.status(500).send({
        message: `Error retrieving User with id=${id}`,
      });
    });
});

// Delete a User with id
router.delete('/:id', auth, async (req, res) => {
  const { id } = req.params;

  User.destroy({
    where: { id },
  })
    .then((num) => {
      if (Number(num) === 1) {
        res.send({
          message: 'User was deleted successfully!',
        });
      } else {
        res.send({
          message: `Cannot delete User with id=${id}. Maybe User was not found!`,
        });
      }
    })
    .catch(() => {
      res.status(409).send({
        message: `Could not delete User with id=${id}`,
      });
    });
});

// Delete all Users
router.delete('/', auth, async (req, res) => {
  User.destroy({
    where: {},
    truncate: false,
  })
    .then((nums) => {
      res.send({
        message: `${nums} Users were deleted successfully!`,
      });
    })
    .catch((err) => {
      if (err.name === 'SequelizeForeignKeyConstraintError') {
        res.status(409).send({
          message: 'Cannot delete user due to foreign key constraint.',
        });
      } else {
        res.status(500).send({
          message: 'Some error occurred while removing all users.',
        });
      }
    });
});

module.exports = router;
