const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

const Professor = require('../models/professor');
const Settings = require('../models/settings');

const { capitalizeWords, lowercaseNoSpace } = require('../utils');

exports.login = (req, res) => {
  const { username, password } = req.body;

  const new_username = lowercaseNoSpace(username);

  Professor.findOne({
    where: {
      [Op.or]: [{ username: new_username }, { email: new_username }],
    },
  })
    .then((user) => {
      if (!user) {
        return res.status(404).json({
          message: 'User not found',
        });
      }

      if (!user.is_verified) {
        return res.status(410).json({
          message: 'User is not verified. Please check your email',
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
          { id: user.id, username: user.username },
          process.env.JWT_SECRET,
          { expiresIn: '12h' },
        );

        // Return the token to the client
        res.json({
          user: {
            id: user.id,
            first_name: user.first_name,
            last_name: user.last_name,
            gender: user.gender,
            username: user.username,
            email: user.email,
            is_admin: user.is_admin,
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
};

exports.register = async (req, res) => {
  const {
    language,
    first_name,
    last_name,
    gender,
    username,
    email,
    password,
    department_id,
  } = req.body;

  const new_first_name = capitalizeWords(first_name);
  const new_last_name = capitalizeWords(last_name);
  const new_username = lowercaseNoSpace(username);
  const new_email = lowercaseNoSpace(email);

  const full_email = new_email.includes('@')
    ? new_email
    : `${new_email}@uet.edu.al`;

  try {
    // Check if username already exists
    const existingUser = await Professor.findOne({
      where: { username: new_username },
    });
    if (existingUser) {
      return res.status(400).send({ message: 'Username already exists' });
    }

    // Check if email already exists
    const existingEmail = await Professor.findOne({
      where: { email: full_email },
    });
    if (existingEmail) {
      return res.status(400).send({ message: 'Email already exists' });
    }

    const verificationToken = crypto.randomBytes(20).toString('hex');

    const newProfessorData = {
      first_name: new_first_name,
      last_name: new_last_name,
      gender,
      username: new_username,
      email: full_email,
      password,
      department_id: Number(department_id),
      is_admin: false,
      is_verified: false,
      verificationToken, // Add the verification token
      verificationTokenExpires: Date.now() + 3600000, // Token expires in 1 hour
    };

    // Save Professor in the database
    await Professor.create(newProfessorData)
      .then(async () => {
        // Retrieve SMTP settings from the database or environment variables
        const response = await Settings.findOne({ where: { name: 'Email' } });

        if (!response) {
          return res.status(500).json({
            message: 'SMTP settings not found! Contact administrator to activate your account.',
          });
        }

        const emailSettings = typeof response.settings === 'string'
          ? JSON.parse(response.settings)
          : response.settings;

        const {
          smtp_sender,
          smtp_host,
          smtp_port,
          smtp_secure,
          smtp_user,
          smtp_pass,
        } = emailSettings;

        // Set up nodemailer transporter
        const transporter = nodemailer.createTransport({
          host: smtp_host,
          port: smtp_port,
          secure: smtp_secure,
          auth: {
            user: smtp_user,
            pass: smtp_pass,
          },
          tls: {
            rejectUnauthorized: false,
          },
        });

        const base_url = req.headers.origin;
        let emailSubject;
        let emailText;
        if (language === 'sq') {
          emailSubject = 'Verifikimi i llogarisë';
          emailText = `Ju lutemi klikoni në linkun e mëposhtme ose kopjojeni atë në shfletuesin tuaj për të verifikuar llogarinë tuaj:\n\n${base_url}/verify/${verificationToken}\n\n`;
        } else {
          emailSubject = 'Account Verification';
          emailText = `Please click on the following link, or paste this into your browser to verify your account:\n\n${base_url}/verify/${verificationToken}\n\n`;
        }

        const mailOptions = {
          from: {
            name: smtp_sender, // Your Sender name
            address: smtp_user, // Your email address
          },
          to: full_email, // User's email address
          subject: emailSubject,
          text: emailText,
        };

        await transporter.sendMail(mailOptions);
        res.json({
          message:
            'Thanks for registering. Please check your email to verify your account.',
        });
      })
      .catch((err) => res.status(500).json({ message: err }));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.verifyAccount = async (req, res) => {
  const verificationToken = req.params.token;

  try {
    const user = await Professor.findOne({
      where: {
        verificationToken,
        verificationTokenExpires: { [Op.gt]: Date.now() },
      },
    });

    if (!user) {
      return res.status(404).json({ message: 'Invalid or expired token' });
    }

    user.is_verified = true;
    user.verificationToken = null;
    user.verificationTokenExpires = null;
    await user.save();

    res.json({ message: 'Account verified successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.requestPasswordReset = async (req, res) => {
  const { username, language } = req.body;

  const new_username = lowercaseNoSpace(username);

  if (!new_username) {
    return res.status(400).json({
      message: 'Please provide either username or email',
    });
  }

  try {
    const response = await Settings.findOne({ where: { name: 'Email' } });

    if (!response) {
      return res.status(500).json({
        message: 'SMTP settings not found',
      });
    }

    const emailSettings = typeof response.settings === 'string'
      ? JSON.parse(response.settings)
      : response.settings;

    const {
      smtp_sender,
      smtp_host,
      smtp_port,
      smtp_secure,
      smtp_user,
      smtp_pass,
    } = emailSettings;

    // Set up nodemailer transporter
    const transporter = nodemailer.createTransport({
      host: smtp_host,
      port: smtp_port,
      secure: smtp_secure,
      auth: {
        user: smtp_user,
        pass: smtp_pass,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    Professor.findOne({
      where: {
        [Op.or]: [{ username: new_username }, { email: new_username }],
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
        const resetTokenExpiration = Date.now() + 3600000; // Token expires in 1 hour

        user.resetPasswordToken = resetToken; // Add the verification token
        user.resetPasswordExpires = resetTokenExpiration;

        user.save().then(() => {
          const base_url = req.headers.origin;

          let emailSubject;
          let emailText;
          if (language === 'sq') {
            emailSubject = 'Rivendosja e fjalëkalimit';
            emailText = 'Ju po e merrni këtë sepse ju (ose dikush tjetër) keni kërkuar rivendosjen e fjalëkalimit për llogarinë tuaj.\n\n'
              + 'Ju lutemi klikoni në linkun e mëposhtme ose ngjisni këtë në shfletuesin tuaj për të përfunduar procesin:\n\n'
              + `${base_url}/reset/${resetToken}\n\n`
              + 'Nëse nuk e keni kërkuar këtë, ju lutemi injoroni këtë email dhe fjalëkalimi juaj do të mbetet i pandryshuar.\n';
          } else {
            emailSubject = 'Password Reset';
            emailText = 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n'
              + 'Please click on the following link, or paste this into your browser to complete the process:\n\n'
              + `${base_url}/reset/${resetToken}\n\n`
              + 'If you did not request this, please ignore this email and your password will remain unchanged.\n';
          }

          const mailOptions = {
            from: {
              name: smtp_sender, // Your Sender name
              address: smtp_user, // Your email address
            },
            to: user.email, // User's email address
            subject: emailSubject,
            text: emailText,
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
              message:
                'Reset password email sent successfully. The Token will expire for 3 hours.',
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
};

exports.resetPasswordTokenValidation = (req, res) => {
  const resetToken = req.params.token;

  Professor.findOne({
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
    })
    .catch((err) => {
      res.status(500).json({
        message: err,
      });
    });
};

exports.resetPassword = (req, res) => {
  const resetToken = req.params.token;
  const newPassword = req.body.password; // Assuming the field is named 'password'

  Professor.findOne({
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
};

module.exports = exports;
