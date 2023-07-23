const bcrypt = require("bcrypt");

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
      set(value) {
        const saltRounds = 10;
        const hashedPassword = bcrypt.hashSync(value, saltRounds);
        this.setDataValue("password", hashedPassword);
      },
    },
    email: {
      type: Sequelize.STRING,
      unique: true,
    },
    isAdmin: {
      type: Sequelize.BOOLEAN,
    },
  });

  return Users;
};
