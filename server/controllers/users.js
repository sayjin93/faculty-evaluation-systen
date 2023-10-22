const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const db = require('../models');

const Users = db.users;

// Create and Save a new Users
exports.create = (req, res) => {
  // Destructyure object
  const {
    first_name, last_name, username, password, email,
  } = req.body;

  // Validate request
  if (!username || !password || !email) {
    res.status(400).send({
      message: 'Content can not be empty!',
    });
    return;
  }

  // Check if username already exists
  Users.findOne({ where: { username } }).then((user) => {
    if (user) {
      res.status(400).send({
        message: 'Username already exists!',
      });
      return;
    }

    // Check if email already exists
    Users.findOne({ where: { email } }).then((user1) => {
      if (user1) {
        res.status(400).send({
          message: 'Email already exists!',
        });
        return;
      }

      // Create a Users
      const userData = {
        first_name,
        last_name,
        username,
        password,
        email,
        isAdmin: false,
      };

      // Save Users in the database
      Users.create(userData)
        .then((data) => {
          res.send(data);
        })
        .catch((err) => {
          res.status(500).send({
            message:
              err.message || 'Some error occurred while creating the User.',
          });
        });
    });
  });
};

// Retrieve all Users from the database.
exports.findAll = (req, res) => {
  Users.findAll()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Some error occurred while retrieving users.',
      });
    });
};

// Login a User
exports.login = (req, res) => {
  const { username, password } = req.body;

  Users.findOne({
    where: {
      [Op.or]: [{ username }, { email: username }],
    },
  })
    .then((user) => {
      if (!user) {
        res.status(404).send({
          message: 'User not found!',
        });
        return;
      }

      // Compare the provided password with the stored hashed password
      bcrypt.compare(password, user.password, (err, result) => {
        if (err) {
          res.status(500).send({
            message: 'Internal server error.',
          });
          return;
        }

        if (!result) {
          res.status(401).send({
            message: 'Invalid password.',
          });
          return;
        }

        const token = jwt.sign(
          {
            id: user.id,
            email: user.email,
          },
          process.env.JWT_SECRET,
          {
            expiresIn: '2h',
          },
        );

        // Return the token to the client
        res.send(token);
      });
    })
    .catch(() => {
      res.status(500).send({
        message: 'Internal server error.',
      });
    });
};

// Find a single Users with an id
exports.findOne = (req, res) => {
  const { id } = req.params;

  Users.findByPk(id)
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find Users with id=${id}.`,
        });
      }
    })
    .catch(() => {
      res.status(500).send({
        message: `Error retrieving Users with id=${id}`,
      });
    });
};

// Find a Users with a specific username
exports.findOneByUsername = (req, res) => {
  const { username } = req.params;

  Users.findAll({ where: { username } })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Some error occurred while retrieving Courses.',
      });
    });
};

// Update a Users by the id in the request
// Update a Users by the id in the request
exports.update = (req, res) => {
  const { id } = req.params;
  const {
    firstName, lastName, username, email, currentPassword, newPassword,
  } = req.body;

  // Fetch the user
  Users.findByPk(id)
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
        Users.findOne({
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
            Users.update(
              {
                first_name: firstName,
                last_name: lastName,
                username,
                email,
                password: newPassword,
              },
              { where: { id } },
            )
              .then((num) => {
                if (num === 1) {
                  // Fetch updated user data
                  Users.findByPk(id, {
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
};

// Delete a Users with the specified id in the request
exports.delete = (req, res) => {
  const { id } = req.params;

  Users.destroy({
    where: { id },
  })
    .then((num) => {
      if (num === 1) {
        res.send({
          message: 'Users was deleted successfully!',
        });
      } else {
        res.send({
          message: `Cannot delete Users with id=${id}. Maybe Users was not found!`,
        });
      }
    })
    .catch(() => {
      res.status(500).send({
        message: `Could not delete Users with id=${id}`,
      });
    });
};

// Delete all Users from the database.
exports.deleteAll = (req, res) => {
  Users.destroy({
    where: {},
    truncate: false,
  })
    .then((nums) => {
      res.send({ message: `${nums} Users were deleted successfully!` });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Some error occurred while removing all Users.',
      });
    });
};
