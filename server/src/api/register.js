const express = require('express');
// const { Op } = require('sequelize');

const User = require('../models/user');

const router = express.Router();

router.post('/register', (req, res) => {
  const {
    username, password, email,
  } = req.body;

  // Check if username already exists
  User.findOne({ where: { username } }).then((user) => {
    if (user) {
      return res.status(400).send({
        message: 'Username or email already exists',
      });
    }

    // Check if email already exists
    User.findOne({ where: { email } }).then((user2) => {
      if (user2) {
        return res.status(400).send({
          message: 'Username or email already exists',
        });
      }

      // Create a Users
      const newUser = new User({
        first_name: '',
        last_name: '',
        username,
        password,
        email,
        isAdmin: false,
      });

      newUser.save()
        .then(() => res.json({ message: 'Thanks for registering' })).catch((err) => res.status(500).json({ message: err }));
    });
  });
});

module.exports = router;
