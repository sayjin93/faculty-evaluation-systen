const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const AcademicYear = sequelize.define('Academic-Year', {
  year: {
    type: DataTypes.STRING,
  },
  active: {
    type: DataTypes.BOOLEAN,
  },
});

module.exports = AcademicYear;
