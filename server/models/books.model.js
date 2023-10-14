module.exports = (sequelize, Sequelize) => {
  const Books = sequelize.define("books", {
    title: {
      type: Sequelize.STRING,
    },
    publication_house: {
      type: Sequelize.STRING,
    },
    publication_year: {
      type: Sequelize.DATEONLY,
    },
    academic_year_id: {
      type: Sequelize.INTEGER,
    },
    professor_id: {
      type: Sequelize.INTEGER,
    },
  });

  return Books;
};
