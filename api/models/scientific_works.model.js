module.exports = (sequelize, Sequelize) => {
  const ScientificWorks = sequelize.define("scientific_works", {
    academic_year_id: {
      type: Sequelize.INTEGER,
    },
    professor_id: {
      type: Sequelize.INTEGER,
    },
  });

  return ScientificWorks;
};
