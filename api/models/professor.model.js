module.exports = (sequelize, Sequelize) => {
  const Professor = sequelize.define("professor", {
    first_name: {
      type: Sequelize.STRING,
    },
    last_name: {
      type: Sequelize.STRING,
    },
    gender: {
      type: Sequelize.ENUM("m", "f"),
    },
  });

  return Professor;
};
