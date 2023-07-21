"use strict";

const db = require("../models");

async function seed() {
  const usersData = [
    {
      username: "admin",
      first_name: "Jurgen",
      last_name: "Kruja",
      password: "admin",
      email: "jurgen-kruja@live.com",
      isAdmin: true,
    },
    {
      username: "petraq",
      first_name: "Petraq",
      last_name: "Papajorgji",
      password: "petraq",
      email: "petraq@gmail.com",
      isAdmin: false,
    },
  ];

  for (const user of usersData) {
    const defaultUserData = {
      ...user,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await db.users.findOrCreate({
      where: { username: user.username },
      defaults: defaultUserData,
    });
  }
}

module.exports = seed;
