"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "users",
      [
        {
          first_name: "Jurgen",
          last_name: "Kruja",
          username: "admin",
          password: "admin",
          email: "Wilshere10.",
          isAdmin: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          first_name: "Jane",
          last_name: "Doe",
          username: "user",
          password: "user",
          email: "info@jkruja.com",
          isAdmin: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("users", null, {});
  },
};
