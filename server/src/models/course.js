module.exports = (sequelize, DataTypes) => {
  const Course = sequelize.define('Course', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    number: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    semester: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    week_hours: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    program: {
      type: DataTypes.ENUM('Bachelor', 'Master'),
      allowNull: false,
    },
    academic_year_id: {
      type: DataTypes.INTEGER,
    },
    professor_id: {
      type: DataTypes.INTEGER,

    },
  }, {
    tableName: 'Course', // Explicitly declare the table name
  });

  Course.associate = (models) => {
    Course.belongsTo(models.Professor, { foreignKey: 'professor_id' });
    Course.belongsTo(models.AcademicYear, { foreignKey: 'academic_year_id' });
  };

  return Course;
};
