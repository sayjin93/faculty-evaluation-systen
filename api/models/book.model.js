module.exports = (sequelize, Sequelize) => {
  const Book = sequelize.define("book", {
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
    scientific_work_id: {
      type: Sequelize.INTEGER,
    },
  });

  return Book;
};
