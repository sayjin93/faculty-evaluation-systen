const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Professor = require('./professor');
const AcademicYear = require('./academicYear');

const Book = sequelize.define('Book', {
  title: {
    type: DataTypes.STRING,
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

//  Associations
Book.belongsTo(Professor, { foreignKey: 'professor_id' });
Book.belongsTo(AcademicYear, { foreignKey: 'academic_year_id' });

module.exports = Book;
