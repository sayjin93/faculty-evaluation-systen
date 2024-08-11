module.exports = (sequelize, DataTypes) => {
  const Book = sequelize.define('Book', {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    publication_house: {
      type: DataTypes.STRING,
    },
    publication_year: {
      type: DataTypes.DATEONLY,
    },
    academic_year_id: {
      type: DataTypes.INTEGER,
    },
    professor_id: {
      type: DataTypes.INTEGER,
    },
  });

  Book.associate = (models) => {
    Book.belongsTo(models.AcademicYear, { foreignKey: 'academic_year_id' });
    Book.belongsTo(models.Professor, { foreignKey: 'professor_id' });
  };

  return Book;
};
