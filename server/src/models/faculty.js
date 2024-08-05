const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Faculty = sequelize.define('Faculty', {
  key: {
    type: DataTypes.STRING,
  },
}, {
  paranoid: true, // This enables the soft delete functionality
});

module.exports = Faculty;
