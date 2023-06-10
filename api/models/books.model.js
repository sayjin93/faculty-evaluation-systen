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
    authors: {
      type: Sequelize.STRING,
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
