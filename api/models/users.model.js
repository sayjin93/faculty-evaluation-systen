const SequelizeTokenify = require("sequelize-tokenify");

module.exports = (sequelize, Sequelize) => {
  const Users = sequelize.define("users", {
    first_name: {
      type: Sequelize.STRING,
    },
    last_name: {
      type: Sequelize.STRING,
    },
    username: {
      type: Sequelize.STRING,
      unique: true,
    },
    password: {
      type: Sequelize.STRING,
    },
    token: {
      type: Sequelize.STRING,
      unique: true,
    },
    email: {
      type: Sequelize.STRING,
      unique: true,
    },
    isAdmin: {
      type: Sequelize.BOOLEAN,
    },
  });

  SequelizeTokenify.tokenify(Users, {
    field: "token",
  });

  return Users;
};
