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
    where: { username: "petraq" },
    defaults: {
      first_name: "Petraq",
      last_name: "Papajorgji",
      password: "petraq",
      email: "petraq@gmail.com",
      isAdmin: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });
}

module.exports = seed;
