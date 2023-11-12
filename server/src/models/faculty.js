const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Faculty = sequelize.define('Faculty', {
  key: {
    type: DataTypes.STRING,
  },
  is_deleted: {
    type: DataTypes.BOOLEAN,
  },
});

module.exports = Faculty;
