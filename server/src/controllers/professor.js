const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');

const Professor = require('../models/professor');
const Settings = require('../models/settings');

const {
  capitalizeWords,
  lowercaseNoSpace,
  generateRandomPassword,
} = require('../utils');

exports.createProfessor = async (req, res) => {
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

  const full_email = email.includes('@') ? email : `${email}@uet.edu.al`;

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

  const newPassword = generateRandomPassword();

  const newProfessorData = {
    first_name: new_first_name,
    last_name: new_last_name,
    gender: req.body.gender,
    username: new_username,
    email: full_email,
    password: newPassword,
    is_verified: 1,
    is_deleted: 0,
    is_admin: 0,
  };

  // Save Professor in the database
  await Professor.create(newProfessorData)
    .then(async (data) => {
      // Retrieve SMTP settings from the database or environment variables
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

      const base_url = req.headers.origin;

      const emailSubject = 'Your Account Details';
      const emailText = 'You are receiving this because administration of the system have created an account for your email.\n\n'
        + 'Your login credentials are:\n\n'
        + `Login url: ${base_url}/login\n\n`
        + `Username: ${new_username}\n`
        + `Email: ${full_email}\n`
        + `Password: ${newPassword}\n\n\n`
        + 'If you did not request this, please contact us to remove your email from our database.\n';

      const mailOptions = {
        from: {
          name: smtp_sender, // Your Sender name
          address: smtp_user, // Your email address
        },
        to: new_email, // User's email address
        subject: emailSubject,
        text: emailText,
      };

      await transporter.sendMail(mailOptions);

      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || 'Some error occurred while creating the Professor',
      });
    });
};

exports.getAllProfessors = async (req, res) => {
  const result = await Professor.findAll({ where: { is_admin: false } }).catch(
    (err) => {
      console.log('Error: ', err);
    },
  );

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
};

exports.getProfessorById = async (req, res) => {
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
};

exports.updateProfessor = async (req, res) => {
  const { id } = req.params;
  const {
    first_name,
    last_name,
    gender,
    username,
    email,
    is_verified,
    is_deleted,
    currentPassword,
    newPassword,
  } = req.body;

  const new_first_name = capitalizeWords(first_name);
  const new_last_name = capitalizeWords(last_name);
  const new_username = lowercaseNoSpace(username);
  const new_email = lowercaseNoSpace(email);

  // Define the variable based on the conditions
  const action = (!currentPassword) ? 'editProfessor' : 'editProfile';

  // Fetch the user
  Professor.findByPk(id)
    .then((user) => {
      if (!user) {
        res.status(404).send({
          message: 'User not found!',
        });
        return;
      }

      if (action === 'editProfessor') {
        // Prepare the update object
        const updateObject = {
          first_name: new_first_name,
          last_name: new_last_name,
          gender,
          email: new_email,
          username: new_username,
          is_verified,
          is_deleted,
        };
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
                  'is_verified',
                  'is_deleted',
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
      } else {
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
            email: new_email,
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
      }
    })
    .catch(() => {
      res.status(500).send({
        message: `Error retrieving Professor with id=${id}`,
      });
    });
};

exports.deleteProfessor = async (req, res) => {
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
};

exports.deleteAllProfessors = async (req, res) => {
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
};
