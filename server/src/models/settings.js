module.exports = (sequelize, DataTypes) => {
  const Settings = sequelize.define('Settings', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true, // Assuming each setting name should be unique
    },
    settings: {
      type: DataTypes.JSON,
      allowNull: false,
    },
  }, {
    tableName: 'Settings', // Explicitly declare the table name
  });

  return Settings;
};
