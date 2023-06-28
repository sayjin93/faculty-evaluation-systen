"use strict";

const db = require("../models");

async function seed(queryInterface, Sequelize) {
  await db.courses.findOrCreate({
    where: {
      name: "Course 1",
      number: "C1",
      semester: 1,
      academic_year_id: 1,
      professor_id: 1,
    },
    defaults: {
      name: "Course 1",
      number: "C1",
      semester: 1,
      week_hours: 3,
      program: "Bachelor",
      academic_year_id: 1,
      professor_id: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });
  await db.courses.findOrCreate({
    where: {
      name: "Course 2",
      number: "C2",
      semester: 1,
      academic_year_id: 2,
      professor_id: 1,
    },
    defaults: {
      name: "Course 2",
      number: "C2",
      semester: 1,
      week_hours: 3,
      program: "Bachelor",
      academic_year_id: 2,
      professor_id: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });
  await db.courses.findOrCreate({
    where: {
      name: "Course 3",
      number: "C3",
      semester: 2,
      academic_year_id: 2,
      professor_id: 2,
    },
    defaults: {
      name: "Course 3",
      number: "C3",
      semester: 2,
      week_hours: 3,
      program: "Bachelor",
      academic_year_id: 2,
      professor_id: 2,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });
}

module.exports = seed;
