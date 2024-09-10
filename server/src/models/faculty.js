module.exports = (sequelize, DataTypes) => {
  const Faculty = sequelize.define('Faculty', {
    key: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    tableName: 'Faculty', // Explicitly declare the table name
    paranoid: true, // Enables soft delete
  });

  Faculty.associate = (models) => {
    Faculty.hasMany(models.Department, { foreignKey: 'faculty_id' });
  };

  return Faculty;
};
