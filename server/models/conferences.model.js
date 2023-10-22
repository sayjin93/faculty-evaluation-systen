module.exports = (sequelize, Sequelize) => {
  const Conferences = sequelize.define('conferences', {
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
    academic_year_id: {
      type: Sequelize.INTEGER,
    },
    professor_id: {
      type: Sequelize.INTEGER,
    },
  });

  return Conferences;
};
