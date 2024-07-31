const { Sequelize } = require('sequelize');

// Function declaration moved to root
async function runSeeders(seeds) {
  // Using Promise.all with Array#map for parallel execution (if order doesn't matter)
  await Promise.all(seeds.map((seed) => seed()));

  // If order does matter, use Array#reduce to chain promises
  await seeds.reduce(
    (promise, seed) => promise.then(() => seed()),
    Promise.resolve(),
  );
}

// Create a new Sequelize instance with database configuration
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
  },
);

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.'.bgBlue);

    await sequelize.sync({
      alter: true,
      force: process.env.NODE_ENV === 'development',
      logging: false,
    });
    console.log('All models were synchronized successfully.'.bgGreen);

    if (process.env.DEFAULT_DATA === 'true') {
      const seeds = [
        require('./seeders/settings'),
        require('./seeders/admin'),
        require('./seeders/faculty'),
        require('./seeders/department'),
        require('./seeders/academicYear'),
        require('./seeders/professor'),
        require('./seeders/course'),
        require('./seeders/paper'),
        require('./seeders/book'),
        require('./seeders/conference'),
        require('./seeders/community'),
      ];

      await runSeeders(seeds);
      console.log('Seeding completed successfully!'.bgGreen);
    } else {
      const adminSeeder = require('./seeders/admin');
      await adminSeeder();

      console.log('Admin seeding completed successfully!'.bgGreen);
    }
  } catch (error) {
    console.log('Unable to connect to the database:', error);
  }
})();

module.exports = sequelize;
