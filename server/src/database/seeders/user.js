const User = require('../../models/user');

async function seed() {
  const usersData = [
    {
      username: 'admin',
      first_name: 'Jurgen',
      last_name: 'Kruja',
      password: 'admin',
      email: 'jurgen-kruja@live.com',
      isAdmin: true,
    },
    {
      username: 'petraq',
      first_name: 'Petraq',
      last_name: 'Papajorgji',
      password: 'petraq',
      email: 'petraq@gmail.com',
      isAdmin: true,
    },
    {
      username: 'user',
      first_name: 'John',
      last_name: 'Doe',
      password: 'user',
      email: 'info@jkruja.com',
      isAdmin: false,
    },
  ];

  const promises = usersData.map(async (user) => {
    const defaultUserData = {
      ...user,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await User.findOrCreate({
      where: { username: user.username },
      defaults: defaultUserData,
    });
  });

  await Promise.all(promises);
}

module.exports = seed;
