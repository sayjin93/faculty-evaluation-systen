const { Professor } = require('../../models');

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

module.exports = {
  up: async () => {
    const promises = adminData.map(async (admin) => {
      try {
        const defaultProfessorData = {
          ...admin,
          is_verified: true, // Use boolean instead of 1
          resetPasswordToken: null,
          resetPasswordExpires: null,
          verificationToken: null,
          verificationTokenExpires: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        const [created] = await Professor.findOrCreate({
          where: {
            first_name: admin.first_name,
            last_name: admin.last_name,
            email: admin.email,
          },
          defaults: defaultProfessorData,
        });

        if (created) {
          console.log(`Admin ${admin.first_name} ${admin.last_name} created.`);
        } else {
          console.log(`Admin ${admin.first_name} ${admin.last_name} already exists.`);
        }
      } catch (error) {
        console.error('Error seeding admin:', admin, error);
      }
    });

    await Promise.all(promises);
    console.log('Admin seeding completed.');
  },

  down: async () => {
    // Code to undo the seed, e.g., delete the admin record(s)
    await Professor.destroy({
      where: {
        email: adminData.map((admin) => admin.email),
      },
    });
    console.log('Admin seeding reverted.');
  },
};
