const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Professor = require('./professor');
const AcademicYear = require('./academicYear');

const Course = sequelize.define('Course', {
  name: {
    type: DataTypes.STRING,
  },
  number: {
    type: DataTypes.STRING,
  },
  semester: {
    type: DataTypes.INTEGER,
  },
  week_hours: {
    type: DataTypes.INTEGER,
  },
  program: {
    type: DataTypes.ENUM('Bachelor', 'Master'),
  },
  academic_year_id: {
    type: DataTypes.INTEGER,
  },
  professor_id: {
    type: DataTypes.INTEGER,
  },
});

//  Associations
Course.belongsTo(Professor, { foreignKey: 'professor_id' });
Course.belongsTo(AcademicYear, { foreignKey: 'academic_year_id' });

module.exports = Course;
