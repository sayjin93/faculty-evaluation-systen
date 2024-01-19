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
