"use strict";

const db = require("../models");

async function seed() {
  const papersData = [
    {
      title: "Paper 1",
      journal: "Buletini Shkencor",
      publication: new Date("2022-01-21"),
      academic_year_id: 1,
      professor_id: 1,
    },
    {
      title: "Paper 2",
      journal: "Buletini Shkencor",
      publication: new Date("2023-01-21"),
      academic_year_id: 2,
      professor_id: 1,
    },
    {
      title: "Paper 3",
      journal: "Buletini Shkencor",
      publication: new Date("2023-02-08"),
      academic_year_id: 2,
      professor_id: 2,
    },
  ];

  for (const paper of papersData) {
    const defaultPapersData = {
      ...paper,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await db.papers.findOrCreate({
      where: {
        title: paper.title,
        academic_year_id: paper.academic_year_id,
        professor_id: paper.professor_id,
      },
      defaults: defaultPapersData,
    });
  }
}

module.exports = seed;
