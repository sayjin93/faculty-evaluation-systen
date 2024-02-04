const { DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');
const sequelize = require('../database');

const Department = require('./department');

const Professors = sequelize.define('Professors', {
  first_name: {
    type: DataTypes.STRING,
  },
  last_name: {
    type: DataTypes.STRING,
  },
  gender: {
    type: DataTypes.ENUM('m', 'f'),
  },
  username: {
    type: DataTypes.STRING,
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    set(value) {
      const saltRounds = 10;
      const hashedPassword = bcrypt.hashSync(value, saltRounds);
      this.setDataValue('password', hashedPassword);
    },
  },
  department_id: {
    type: DataTypes.INTEGER,
  },
  is_admin: {
    type: DataTypes.BOOLEAN,
  },
  is_verified: {
    type: DataTypes.BOOLEAN,
  },
  is_deleted: {
    type: DataTypes.BOOLEAN,
  },
  resetPasswordToken: {
    type: DataTypes.STRING,
  },
  resetPasswordExpires: {
    type: DataTypes.DATE,
  },
  verificationToken: {
    type: DataTypes.STRING,
  },
  verificationTokenExpires: {
    type: DataTypes.STRING,
  },
});

//  Associations
Professors.belongsTo(Department, { foreignKey: 'department_id' });

module.exports = Professors;
