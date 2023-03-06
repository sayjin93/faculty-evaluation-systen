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
    scientific_work_id: {
      type: Sequelize.INTEGER,
    },
  });

  return Papers;
};
