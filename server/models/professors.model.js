module.exports = (sequelize, Sequelize) => {
  const Professors = sequelize.define('professors', {
    first_name: {
      type: Sequelize.STRING,
    },
    last_name: {
      type: Sequelize.STRING,
    },
    gender: {
      type: Sequelize.ENUM('m', 'f'),
    },
  });

  return Professors;
};
