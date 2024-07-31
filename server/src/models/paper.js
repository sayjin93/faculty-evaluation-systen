const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Professor = require('./professor');
const AcademicYear = require('./academicYear');

const Paper = sequelize.define('Paper', {
  title: {
    type: DataTypes.STRING,
  },
  journal: {
    type: DataTypes.STRING,
  },
  publication: {
    type: DataTypes.DATE,
  },
  academic_year_id: {
    type: DataTypes.INTEGER,
  },
  professor_id: {
    type: DataTypes.INTEGER,
  },
}, {
  paranoid: true, // This enables the soft delete functionality
});

//  Associations
Paper.belongsTo(Professor, { foreignKey: 'professor_id' });
Paper.belongsTo(AcademicYear, { foreignKey: 'academic_year_id' });

module.exports = Paper;
