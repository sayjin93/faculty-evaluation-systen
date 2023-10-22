module.exports = (sequelize, Sequelize) => {
  const CommunityServices = sequelize.define('community_services', {
    event: {
      type: Sequelize.STRING,
    },
    date: {
      type: Sequelize.DATE,
    },
    description: {
      type: Sequelize.STRING,
    },
    external: {
      type: Sequelize.BOOLEAN,
    },
    academic_year_id: {
      type: Sequelize.INTEGER,
    },
    professor_id: {
      type: Sequelize.INTEGER,
    },
  });

  return CommunityServices;
};
