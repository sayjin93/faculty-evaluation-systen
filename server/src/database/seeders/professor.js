const Professor = require('../../models/professor');

async function seed() {
  const professorsData = [
    {
      first_name: 'Petraq',
      last_name: 'Papajorgji',
      gender: 'm',
      is_deleted: 0,
    },
    {
      first_name: 'Liseta',
      last_name: 'Sholla',
      gender: 'f',
      is_deleted: 0,
    },
    {
      first_name: 'John',
      last_name: 'Doe',
      gender: 'm',
      is_deleted: 0,
    },
    {
      first_name: 'Jane',
      last_name: 'Smith',
      gender: 'f',
      is_deleted: 0,
    },
    {
      first_name: 'Michael',
      last_name: 'Brown',
      gender: 'm',
      is_deleted: 0,
    },
    {
      first_name: 'Emily',
      last_name: 'Johnson',
      gender: 'f',
      is_deleted: 0,
    },
    {
      first_name: 'William',
      last_name: 'Jones',
      gender: 'm',
      is_deleted: 0,
    },
    {
      first_name: 'Olivia',
      last_name: 'Davis',
      gender: 'f',
      is_deleted: 1,
    },
    {
      first_name: 'James',
      last_name: 'Miller',
      gender: 'm',
      is_deleted: 0,
    },
    {
      first_name: 'Emma',
      last_name: 'Wilson',
      gender: 'f',
      is_deleted: 1,
    },
  ];

  const promises = professorsData.map(async (professor) => {
    const defaultProfessorData = {
      ...professor,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await Professor.findOrCreate({
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
