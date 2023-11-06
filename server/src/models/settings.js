const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Settings = sequelize.define('Settings', {
  name: {
    type: DataTypes.STRING,
  },
  settings: {
    type: DataTypes.JSON,
  },
});

module.exports = Settings;
