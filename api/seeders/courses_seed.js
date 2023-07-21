"use strict";

const db = require("../models");

async function seed() {
  const coursesData = [
    {
      name: "Course 1",
      number: "C1",
      semester: 1,
      week_hours: 3,
      program: "Bachelor",
      academic_year_id: 1,
      professor_id: 1,
    },
    {
      name: "Course 2",
      number: "C2",
      semester: 1,
      week_hours: 3,
      program: "Master",
      academic_year_id: 2,
      professor_id: 1,
    },
    {
      name: "Course 3",
      number: "C3",
      semester: 2,
      week_hours: 3,
      program: "Bachelor",
      academic_year_id: 2,
      professor_id: 2,
    },
  ];

  for (const course of coursesData) {
    const defaultCourseData = {
      ...course,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await db.courses.findOrCreate({
      where: {
        name: course.name,
        number: course.number,
        academic_year_id: course.academic_year_id,
        professor_id: course.professor_id,
      },
      defaults: defaultCourseData,
    });
  }
}

module.exports = seed;
