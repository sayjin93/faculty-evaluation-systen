module.exports = (sequelize, Sequelize) => {
  const Papers = sequelize.define("papers", {
    title: {
      type: Sequelize.STRING,
    },
    journal: {
      type: Sequelize.STRING,
    },
    publication: {
      type: Sequelize.DATE,
    },
    academic_year_id: {
      type: Sequelize.INTEGER,
    },
    professor_id: {
      type: Sequelize.INTEGER,
    },
  });

  return Papers;
};
