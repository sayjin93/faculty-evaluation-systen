"use strict";

const db = require("../models");

async function seed(queryInterface, Sequelize) {
  await db.users.findOrCreate({
    where: { username: "admin" },
    defaults: {
      first_name: "Jurgen",
      last_name: "Kruja",
      password: "admin",
      email: "jurgen-kruja@live.com",
      isAdmin: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  await db.users.findOrCreate({
    where: { username: "user" },
    defaults: {
      first_name: "Ardit",
      last_name: "Bejtulla",
      password: "user",
      email: "info@jkruja.com",
      isAdmin: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });
}

module.exports = seed;
