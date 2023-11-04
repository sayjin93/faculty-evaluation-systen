const { DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');
const sequelize = require('../database');

const Users = sequelize.define('Users', {
  first_name: {
    type: DataTypes.STRING,
  },
  last_name: {
    type: DataTypes.STRING,
  },
  username: {
    type: DataTypes.STRING,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    set(value) {
      const saltRounds = 10;
      const hashedPassword = bcrypt.hashSync(value, saltRounds);
      this.setDataValue('password', hashedPassword);
    },
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
  },
  isAdmin: {
    type: DataTypes.BOOLEAN,
  },
  resetPasswordToken: {
    type: DataTypes.STRING,
  },
  resetPasswordExpires: {
    type: DataTypes.DATE,
  },
});

module.exports = Users;
