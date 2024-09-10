module.exports = (sequelize, DataTypes) => {
  const AcademicYear = sequelize.define('AcademicYear', {
    year: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  }, {
    tableName: 'AcademicYear', // Explicitly declare the table name
    paranoid: true, // Enables soft delete
  });

  AcademicYear.associate = (models) => {
    AcademicYear.hasMany(models.Course, { foreignKey: 'academic_year_id' });
    AcademicYear.hasMany(models.Paper, { foreignKey: 'academic_year_id' });
    AcademicYear.hasMany(models.Book, { foreignKey: 'academic_year_id' });
    AcademicYear.hasMany(models.Conference, { foreignKey: 'academic_year_id' });
    AcademicYear.hasMany(models.Community, { foreignKey: 'academic_year_id' });
  };

  return AcademicYear;
};
