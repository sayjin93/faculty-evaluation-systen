"use strict";

const db = require("../models");

async function seed() {
  const communitiesData = [
    {
      event: "Community Service 1",
      time: new Date("2022-01-21"),
      description: "Description for Community service 1",
      external: 1,
      academic_year_id: 1,
      professor_id: 1,
    },
    {
      event: "Community Service 2",
      time: new Date("2022-03-15"),
      description: "Description for Community service 2",
      external: 0,
      academic_year_id: 1,
      professor_id: 2,
    },
    {
      event: "Community Service 3",
      time: new Date("2023-05-10"),
      description: "Description for Community service 3",
      external: 1,
      academic_year_id: 2,
      professor_id: 3,
    },
    {
      event: "Community Service 4",
      time: new Date("2023-07-02"),
      description: "Description for Community service 4",
      external: 1,
      academic_year_id: 2,
      professor_id: 4,
    },
    {
      event: "Community Service 5",
      time: new Date("2022-09-30"),
      description: "Description for Community service 5",
      external: 0,
      academic_year_id: 1,
      professor_id: 5,
    },
    {
      event: "Community Service 6",
      time: new Date("2023-01-15"),
      description: "Description for Community service 6",
      external: 1,
      academic_year_id: 2,
      professor_id: 6,
    },
    {
      event: "Community Service 7",
      time: new Date("2022-11-20"),
      description: "Description for Community service 7",
      external: 0,
      academic_year_id: 1,
      professor_id: 7,
    },
    {
      event: "Community Service 8",
      time: new Date("2023-03-08"),
      description: "Description for Community service 8",
      external: 1,
      academic_year_id: 2,
      professor_id: 8,
    },
    {
      event: "Community Service 9",
      time: new Date("2022-05-12"),
      description: "Description for Community service 9",
      external: 0,
      academic_year_id: 1,
      professor_id: 9,
    },
    {
      event: "Community Service 10",
      time: new Date("2023-09-18"),
      description: "Description for Community service 10",
      external: 1,
      academic_year_id: 2,
      professor_id: 10,
    },
  ];

  for (const community of communitiesData) {
    const defaultCommunitiesData = {
      ...community,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await db.community_services.findOrCreate({
      where: {
        event: community.event,
        academic_year_id: community.academic_year_id,
        professor_id: community.professor_id,
      },
      defaults: defaultCommunitiesData,
    });
  }
}

module.exports = seed;
