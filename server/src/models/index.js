const { Sequelize } = require('sequelize');
const fs = require('fs');
const path = require('path');

const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require('../config/database')[env];

const db = {};

// Initialize Sequelize
const sequelize = new Sequelize(config.database, config.username, config.password, config);

// Import all models in the models directory
fs.readdirSync(__dirname)
  .filter((file) => (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js'))
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

// Set up associations if they exist
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// Export the db object, which contains Sequelize and all models
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
