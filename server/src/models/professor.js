const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Professors = sequelize.define('Professors', {
  first_name: {
    type: DataTypes.STRING,
  },
  last_name: {
    type: DataTypes.STRING,
  },
  gender: {
    type: DataTypes.ENUM('m', 'f'),
  },
});

module.exports = Professors;
