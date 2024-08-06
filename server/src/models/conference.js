const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Professor = require('./professor');
const AcademicYear = require('./academicYear');

const Conference = sequelize.define('Conference', {
  name: {
    type: DataTypes.STRING,
  },
  location: {
    type: DataTypes.STRING,
  },
  present_title: {
    type: DataTypes.STRING,
  },
  authors: {
    type: DataTypes.STRING,
  },
  dates: {
    type: DataTypes.STRING,
  },
  academic_year_id: {
    type: DataTypes.INTEGER,
  },
  professor_id: {
    type: DataTypes.INTEGER,
  },
});

//  Associations
Conference.belongsTo(Professor, { foreignKey: 'professor_id' });
Conference.belongsTo(AcademicYear, { foreignKey: 'academic_year_id' });

module.exports = Conference;
