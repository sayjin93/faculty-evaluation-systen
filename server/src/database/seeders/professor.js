const Professor = require('../../models/professor');

async function seed() {
  const professorsData = [
    {
      first_name: 'Jurgen',
      last_name: 'Kruja',
      gender: 'm',
      username: 'admin',
      password: 'admin',
      email: 'jurgen-kruja@live.com',
      is_admin: 1,
      is_deleted: 0,
    },
    {
      first_name: 'Petraq',
      last_name: 'Papajorgji',
      gender: 'm',
      username: 'ppapajorgji',
      password: 'petraq@@',
      email: 'ppapajorgji@uet.edu.al',
      is_admin: 0,
      is_deleted: 0,
    },
    {
      first_name: 'Liseta',
      last_name: 'Sholla',
      gender: 'f',
      username: 'lsholla',
      password: 'liseta@@',
      email: 'lsholla@uet.edu.al',
      is_admin: 0,
      is_deleted: 0,
    },
    {
      first_name: 'John',
      last_name: 'Doe',
      gender: 'm',
      username: 'jdoe',
      password: 'jojm@@',
      email: 'jdoe@uet.edu.al',
      is_admin: 0,
      is_deleted: 0,
    },
    {
      first_name: 'Jane',
      last_name: 'Smith',
      gender: 'f',
      username: 'jsmith',
      password: 'jane@@',
      email: 'jsmith@uet.edu.al',
      is_admin: 0,
      is_deleted: 0,
    },
    {
      first_name: 'Michael',
      last_name: 'Brown',
      gender: 'm',
      username: 'mbrown',
      password: 'michael@@',
      email: 'mbrown@uet.edu.al',
      is_admin: 0,
      is_deleted: 0,
    },
    {
      first_name: 'Emily',
      last_name: 'Johnson',
      gender: 'f',
      username: 'ejohnson',
      password: 'emily@@',
      email: 'ejohnson@uet.edu.al',
      is_admin: 0,
      is_deleted: 0,
    },
    {
      first_name: 'William',
      last_name: 'Jones',
      gender: 'm',
      username: 'wjones',
      password: 'william@@',
      email: 'wjones@uet.edu.al',
      is_admin: 0,
      is_deleted: 0,
    },
    {
      first_name: 'Olivia',
      last_name: 'Davis',
      gender: 'f',
      username: 'odavis',
      password: 'olivia@@',
      email: 'odavis@uet.edu.al',
      is_admin: 0,
      is_deleted: 1,
    },
    {
      first_name: 'James',
      last_name: 'Miller',
      gender: 'm',
      username: 'jmiller',
      password: 'james@@',
      email: 'jmiller@uet.edu.al',
      is_admin: 0,
      is_deleted: 0,
    },
    {
      first_name: 'Emma',
      last_name: 'Wilson',
      gender: 'f',
      username: 'ewilson',
      password: 'ema@@',
      email: 'ewilson@uet.edu.al',
      is_admin: 0,
      is_deleted: 1,
    },
  ];

  const promises = professorsData.map(async (professor) => {
    const defaultProfessorData = {
      ...professor,
      is_verified: 1,
      resetPasswordToken: null,
      resetPasswordExpires: null,
      verificationToken: null,
      verificationTokenExpires: null,
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
