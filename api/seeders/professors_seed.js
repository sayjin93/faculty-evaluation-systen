"use strict";

const db = require("../models");

async function seed(queryInterface, Sequelize) {
  await db.professors.findOrCreate({
    where: { first_name: "Petraq", last_name: "Papajorgji" },
    defaults: {
      first_name: "Petraq",
      last_name: "Papajorgji",
      gender: "m",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  await db.professors.findOrCreate({
    where: { first_name: "Liseta", last_name: "Sholla" },
    defaults: {
      first_name: "Liseta",
      last_name: "Sholla",
      gender: "f",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });
}

module.exports = seed;
