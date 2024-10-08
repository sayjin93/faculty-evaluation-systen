const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');

const {
  Professor, Settings, Book, Community, Conference, Course, Paper,
} = require('../models');

const {
  capitalizeWords,
  lowercaseNoSpace,
  generateRandomPassword,
} = require('../utils/helpers');

exports.create = async (req, res) => {
  const {
    first_name, last_name, gender, username, email, department_id,
  } = req.body;

  // Validate request
  if (!first_name || !last_name || !gender || !username || !email || !department_id) {
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
    department_id,
    password: newPassword,
    is_verified: 1,
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
exports.getAll = async (req, res) => {
  try {
    const result = await Professor.findAll({
      where: { is_admin: false },
      paranoid: false, // This includes the soft-deleted records
    }).catch(
      (err) => {
        console.log('Error: ', err);
      },
    );

    if (!result || result.length === 0) {
      return res.json({ message: 'No Professors found' });
    }

    // Modify gender property in the result array
    const modifiedResult = result.map((professor) => ({
      id: professor.id,
      first_name: professor.first_name,
      last_name: professor.last_name,
      gender: professor.gender === 'm' ? 'Male' : 'Female',
      username: professor.username,
      email: professor.email,
      department_id: professor.department_id,
      is_verified: professor.is_verified,
      createdAt: professor.createdAt,
      updatedAt: professor.updatedAt,
      deletedAt: professor.deletedAt,
    }));

    res.send(modifiedResult);
  } catch (err) {
    console.log('Error: ', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
exports.getOne = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await Professor.findByPk(id);

    if (!result) {
      return res.status(404).send({ message: `Cannot find Professor with id=${id}` });
    }

    res.send(result);
  } catch (err) {
    res.status(500).send({ message: `Error retrieving Department with id=${id}` });
  }
};
exports.update = async (req, res) => {
  const { id } = req.params;
  const {
    first_name,
    last_name,
    gender,
    username,
    email,
    department_id,
    is_verified,
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
          department_id,
          is_verified,
        };
        // Update the Professor
        Professor.update(updateObject, { where: { id } })
          .then((num) => {
            if (Number(num) === 1) {
              res.send({ message: 'Professor updated successfully' });
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
            // email: new_email, //not allowed to change it
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
exports.delete = async (req, res) => {
  const { id } = req.params;
  try {
    // Check for related records
    const bookCount = await Book.count({ where: { professor_id: id } });
    const communityCount = await Community.count({ where: { professor_id: id } });
    const conferenceCount = await Conference.count({ where: { professor_id: id } });
    const courseCount = await Course.count({ where: { professor_id: id } });
    const paperCount = await Paper.count({ where: { professor_id: id } });

    if (bookCount > 0 || communityCount > 0 || conferenceCount > 0 || courseCount > 0 || paperCount > 0) {
      return res.status(400).send({ message: 'Cannot delete with existing associations.' });
    }

    const result = await Professor.destroy({ where: { id } });

    if (Number(result) === 1) {
      res.send({ message: 'Professor deleted successfully' });
    } else {
      res.send({ message: `Cannot delete Professor with id=${id}. Maybe Professor was not found!` });
    }
  } catch (err) {
    res.status(500).send({ message: `Could not delete Professor with id=${id}` });
  }
};
exports.restore = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await Professor.restore({ where: { id } });
    if (Number(result) === 1) {
      res.send({ message: 'Professor restored successfully' });
    } else {
      res.send({ message: `Cannot restore Professor with id=${id}. Maybe Faculty was not found!` });
    }
  } catch (err) {
    res.status(500).send({ message: `Error restoring Professor with id=${id}` });
  }
};
