module.exports = (sequelize, DataTypes) => {
  const Faculty = sequelize.define('Faculty', {
    key: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    paranoid: true, // Enables soft delete
  });

  Faculty.associate = (models) => {
    Faculty.hasMany(models.Department, { foreignKey: 'faculty_id' });
  };

  return Faculty;
};
