const db = require('../models');

async function seed() {
  const professorsData = [
    {
      first_name: 'Petraq',
      last_name: 'Papajorgji',
      gender: 'm',
    },
    {
      first_name: 'Liseta',
      last_name: 'Sholla',
      gender: 'f',
    },
    {
      first_name: 'John',
      last_name: 'Doe',
      gender: 'm',
    },
    {
      first_name: 'Jane',
      last_name: 'Smith',
      gender: 'f',
    },
    {
      first_name: 'Michael',
      last_name: 'Brown',
      gender: 'm',
    },
    {
      first_name: 'Emily',
      last_name: 'Johnson',
      gender: 'f',
    },
    {
      first_name: 'William',
      last_name: 'Jones',
      gender: 'm',
    },
    {
      first_name: 'Olivia',
      last_name: 'Davis',
      gender: 'f',
    },
    {
      first_name: 'James',
      last_name: 'Miller',
      gender: 'm',
    },
    {
      first_name: 'Emma',
      last_name: 'Wilson',
      gender: 'f',
    },
  ];

  const promises = professorsData.map(async (professor) => {
    const defaultProfessorData = {
      ...professor,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await db.professors.findOrCreate({
      where: {
        first_name: professor.first_name,
        last_name: professor.last_name,
      },
      defaults: defaultProfessorData,
    });
  });

  await Promise.all(promises);
}

module.exports = seed;
