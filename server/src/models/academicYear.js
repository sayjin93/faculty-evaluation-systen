const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const AcademicYear = sequelize.define('Academic-Year', {
  year: {
    type: DataTypes.STRING,
    unique: true,
  },
  active: {
    type: DataTypes.BOOLEAN,
  },
}, {
  paranoid: true, // This enables the soft delete functionality
});

module.exports = AcademicYear;
