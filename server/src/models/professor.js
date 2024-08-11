const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
  const Professor = sequelize.define('Professor', {
    first_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    gender: {
      type: DataTypes.ENUM('m', 'f'),
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
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
      defaultValue: false,
    },
    is_verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
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
      type: DataTypes.DATE,
    },
  }, {
    paranoid: true, // Enables soft delete
  });

  Professor.associate = (models) => {
    Professor.belongsTo(models.Department, { foreignKey: 'department_id' });
    Professor.hasMany(models.Course, { foreignKey: 'professor_id' });
    Professor.hasMany(models.Paper, { foreignKey: 'professor_id' });
    Professor.hasMany(models.Book, { foreignKey: 'professor_id' });
    Professor.hasMany(models.Conference, { foreignKey: 'professor_id' });
    Professor.hasMany(models.Community, { foreignKey: 'professor_id' });
  };

  return Professor;
};
