const db = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Users = db.users;

// Create and Save a new Users
exports.create = (req, res) => {
  //Destructyure object
  const { first_name, last_name, username, password, email } = req.body;

  // Validate request
  if (!username || !password || !email) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
    return;
  }

  // Check if username already exists
  Users.findOne({ where: { username: username } }).then((user) => {
    if (user) {
      res.status(400).send({
        message: "Username already exists!",
      });
      return;
    }

    // Check if email already exists
    Users.findOne({ where: { email: email } }).then((user) => {
      if (user) {
        res.status(400).send({
          message: "Email already exists!",
        });
        return;
      }

      // Hash the password
      bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
          res.status(500).send({
            message: "Error hashing password!",
          });
          return;
        }

        // Create a Users
        const userData = {
          first_name,
          last_name,
          username,
          password: hashedPassword, // Store the hashed password
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
                err.message || "Some error occurred while creating the User.",
            });
          });
      });
    });
  });
};

// Retrieve all Users from the database.
exports.findAll = (req, res) => {
  const { username, password } = req.body;

  Users.findOne({
    where: { username: username },
  })
    .then((user) => {
      if (!user) {
        res.status(404).send({
          message: "User not found.",
        });
        return;
      }

      // Compare the provided password with the stored hashed password
      bcrypt.compare(password, user.password, (err, result) => {
        if (err) {
          res.status(500).send({
            message: "Internal server error.",
          });
          return;
        }

        if (!result) {
          res.status(401).send({
            message: "Invalid password.",
          });
          return;
        }

        const token = jwt.sign(
          { username: username, password: password },
          process.env.JWT_SECRET_KEY,
          {
            expiresIn: "2h",
          }
        );

        // Return the token to the client
        res.send(token);
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: "Internal server error.",
      });
    });
};

// Find a single Users with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

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
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving Users with id=" + id,
      });
    });
};

// Find a Users with a specific username
exports.findOneByUsername = (req, res) => {
  const username = req.params.username;

  Users.findAll({ where: { username: username } })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving Courses.",
      });
    });
};

// Update a Users by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  Users.update(req.body, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Users was updated successfully.",
        });
      } else {
        res.send({
          message: `Cannot update Users with id=${id}. Maybe Users was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating Users with id=" + id,
      });
    });
};

// Delete a Users with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Users.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Users was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete Users with id=${id}. Maybe Users was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete Users with id=" + id,
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
        message: err.message || "Some error occurred while removing all Users.",
      });
    });
};
