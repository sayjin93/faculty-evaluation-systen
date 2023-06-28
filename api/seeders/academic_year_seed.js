"use strict";

const db = require("../models");

async function seed(queryInterface, Sequelize) {
  await db.academic_years.findOrCreate({
    where: { year: "2021-2022" },
    defaults: {
      year: "2021-2022",
      active: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  await db.academic_years.findOrCreate({
    where: { year: "2022-2023" },
    defaults: {
      year: "2022-2023",
      active: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });
}

module.exports = seed;
