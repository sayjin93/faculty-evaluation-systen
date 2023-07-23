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
    {
      name: "Course 4",
      number: "C4",
      semester: 2,
      week_hours: 4,
      program: "Master",
      academic_year_id: 1,
      professor_id: 3,
    },
    {
      name: "Course 5",
      number: "C5",
      semester: 1,
      week_hours: 3,
      program: "Bachelor",
      academic_year_id: 2,
      professor_id: 5,
    },
    {
      name: "Course 6",
      number: "C6",
      semester: 1,
      week_hours: 4,
      program: "Master",
      academic_year_id: 1,
      professor_id: 6,
    },
    {
      name: "Course 7",
      number: "C7",
      semester: 2,
      week_hours: 3,
      program: "Bachelor",
      academic_year_id: 2,
      professor_id: 7,
    },
    {
      name: "Course 8",
      number: "C8",
      semester: 1,
      week_hours: 4,
      program: "Bachelor",
      academic_year_id: 1,
      professor_id: 1,
    },
    {
      name: "Course 9",
      number: "C9",
      semester: 2,
      week_hours: 4,
      program: "Master",
      academic_year_id: 1,
      professor_id: 8,
    },
    {
      name: "Course 10",
      number: "C10",
      semester: 2,
      week_hours: 3,
      program: "Bachelor",
      academic_year_id: 2,
      professor_id: 10,
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
