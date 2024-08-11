module.exports = (sequelize, DataTypes) => {
  const Department = sequelize.define('Department', {
    key: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    faculty_id: {
      type: DataTypes.INTEGER,

    },
  }, {
    paranoid: true, // Enables soft delete
  });

  Department.associate = (models) => {
    Department.belongsTo(models.Faculty, { foreignKey: 'faculty_id' });
  };

  return Department;
};
