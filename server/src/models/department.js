const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Faculty = require('./faculty');

const Department = sequelize.define('Department', {
  key: {
    type: DataTypes.STRING,
  },
  faculty_id: {
    type: DataTypes.INTEGER,
  },
});

//  Associations
Department.belongsTo(Faculty, { foreignKey: 'faculty_id' });

module.exports = Department;