const Professor = require('../../models/professor');

// Temp data
const adminData = [
  {
    first_name: 'Jurgen',
    last_name: 'Kruja',
    gender: 'm',
    username: 'admin',
    password: 'admin',
    email: 'jurgen-kruja@live.com',
    is_admin: 1,
  },
];

async function seed() {
  const promises = adminData.map(async (admin) => {
    try {
      const defaultProfessorData = {
        ...admin,
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
          first_name: admin.first_name,
          last_name: admin.last_name,
          email: admin.email,
        },
        defaults: defaultProfessorData,
      });
    } catch (error) {
      console.error('Error seeding admin:', admin, error);
    }
  });

  await Promise.all(promises);
}

module.exports = seed;
