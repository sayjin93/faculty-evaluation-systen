module.exports = (sequelize, Sequelize) => {
  const CommunityService = sequelize.define("community_service", {
    event: {
      type: Sequelize.STRING,
    },
    time: {
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
    preofessor_id: {
      type: Sequelize.INTEGER,
    },
  });

  return CommunityService;
};
