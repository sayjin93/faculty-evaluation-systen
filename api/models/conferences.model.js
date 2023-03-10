module.exports = (sequelize, Sequelize) => {
  const Conferences = sequelize.define("conferences", {
    name: {
      type: Sequelize.STRING,
    },
    location: {
      type: Sequelize.STRING,
    },
    present_title: {
      type: Sequelize.STRING,
    },
    authors: {
      type: Sequelize.STRING,
    },
    dates: {
      type: Sequelize.STRING,
    },
    scientific_work_id: {
      type: Sequelize.INTEGER,
    },
  });

  return Conferences;
};
