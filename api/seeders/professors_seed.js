"use strict";

const db = require("../models");

async function seed() {
  const professorsData = [
    {
      first_name: "Petraq",
      last_name: "Papajorgji",
      gender: "m",
    },
    {
      first_name: "Liseta",
      last_name: "Sholla",
      gender: "f",
    },
  ];

  for (const professor of professorsData) {
    const defaultProfessorData = {
      ...professor,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await db.professors.findOrCreate({
      where: { first_name: professor.first_name, last_name: professor.last_name },
      defaults: defaultProfessorData,
    });
  }
}

module.exports = seed;
