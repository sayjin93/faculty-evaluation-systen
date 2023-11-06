const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

const User = require('../models/user');
const Settings = require('../models/settings');

const router = express.Router();

router.post('/login', (req, res) => {
  const { username, password } = req.body;

  User.findOne({
    where: {
      [Op.or]: [{ username }, { email: username }],
    },
  })
    .then((user) => {
      if (!user) {
        return res.status(404).json({
          message: 'User not found',
        });
      }

      // Compare the provided password with the stored hashed password
      bcrypt.compare(password, user.password, (err, result) => {
        if (err) {
          return res.status(500).json({ message: err });
        }

        if (!result) {
          return res.status(401).json({
            message: 'Invalid password',
          });
        }

        const jwtToken = jwt.sign(
          {
            id: user.id,
            email: user.email,
          },
          process.env.JWT_SECRET,
          {
            expiresIn: '12h',
          },
        );

        // Return the token to the client
        res.json({
          user: {
            id: user.id,
            first_name: user.first_name,
            last_name: user.last_name,
            username: user.username,
            email: user.email,
          },
          token: jwtToken,
        });
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: err,
      });
    });
});

router.post('/register', (req, res) => {
  const {
    first_name, last_name, username, password, email,
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
        first_name,
        last_name,
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

router.post('/reset', async (req, res) => {
  const { username } = req.body;

  if (!username) {
    return res.status(400).json({
      message: 'Please provide either username or email',
    });
  }

  try {
    const emailSettings = await Settings.findOne({ where: { name: 'Email' } });

    if (!emailSettings) {
      return res.status(500).json({
        message: 'SMTP settings not found',
      });
    }

    const transporter = nodemailer.createTransport({
      host: emailSettings.settings.smtp_host,
      port: emailSettings.settings.smtp_port,
      secure: emailSettings.settings.smtp_secure,
      auth: {
        user: emailSettings.settings.smtp_user,
        pass: emailSettings.settings.smtp_pass,
      },
    });

    User.findOne({
      where: {
        [Op.or]: [{ username }, { email: username }],
      },
    })
      .then((user) => {
        if (!user) {
          return res.status(404).json({
            message: 'User not found',
          });
        }

        // Update the user with the reset token and expiration
        const resetToken = crypto.randomBytes(20).toString('hex');
        const resetTokenExpiration = Date.now() + 3600000;

        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = resetTokenExpiration;

        user.save().then(() => {
          const base_url = req.headers.origin;

          const mailOptions = {
            from: {
              name: 'UET Support', // Your Sender name
              address: emailSettings.settings.smtp_user, // Your email address
            },
            to: user.email, // User's email address
            subject: 'Password Reset',
            text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n'
              + 'Please click on the following link, or paste this into your browser to complete the process:\n\n'
              + `${base_url}/reset/${resetToken}\n\n`
              + 'If you did not request this, please ignore this email and your password will remain unchanged.\n',
          };

          transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
              return res.status(500).json({
                message: error.response,
              });
            }

            // You can log or use 'info' for debugging or auditing purposes
            console.log('Email sent:', info);

            res.json({
              message: 'Reset password email sent successfully. The Token will expire for 3 hours.',
            });
          });
        });
      })
      .catch((err) => {
        res.status(500).json({
          message: err,
        });
      });
  } catch (error) {
    console.error('Error retrieving SMTP settings:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.get('/reset/:token', (req, res) => {
  const resetToken = req.params.token;

  User.findOne({
    where: {
      resetPasswordToken: resetToken,
      resetPasswordExpires: { [Op.gt]: Date.now() }, // Check if token is still valid
    },
  })
    .then((user) => {
      if (!user) {
        return res.status(404).json({
          message: 'Invalid or expired token',
        });
      }

      res.json({
        token: resetToken,
      });
      // // Here you can render a form for the user to reset their password
      // res.render('resetPasswordForm', { resetToken });
    })
    .catch((err) => {
      res.status(500).json({
        message: err,
      });
    });
});

router.post('/reset/:token', (req, res) => {
  const resetToken = req.params.token;
  const newPassword = req.body.password; // Assuming the field is named 'password'

  User.findOne({
    where: {
      resetPasswordToken: resetToken,
      resetPasswordExpires: { [Op.gt]: Date.now() },
    },
  })
    .then((user) => {
      if (!user) {
        return res.status(404).json({
          message: 'Invalid or expired token',
        });
      }

      // Update the user's password
      user.password = newPassword;
      user.resetPasswordToken = null;
      user.resetPasswordExpires = null;

      user.save().then(() => {
        res.json({
          message: 'Password reset successful',
        });
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: err,
      });
    });
});

module.exports = router;
