const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Professor = require('./professor');
const AcademicYear = require('./academicYear');

const Community = sequelize.define('Community', {
  event: {
    type: DataTypes.STRING,
  },
  date: {
    type: DataTypes.DATE,
  },
  description: {
    type: DataTypes.STRING,
  },
  external: {
    type: DataTypes.BOOLEAN,
  },
  academic_year_id: {
    type: DataTypes.INTEGER,
  },
  professor_id: {
    type: DataTypes.INTEGER,
  },
});

//  Associations
Community.belongsTo(Professor, { foreignKey: 'professor_id' });
Community.belongsTo(AcademicYear, { foreignKey: 'academic_year_id' });

module.exports = Community;
