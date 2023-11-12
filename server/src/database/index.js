const { Sequelize } = require('sequelize');

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
    // Authenticate the connection to the database
    await sequelize.authenticate();
    console.log('Connection has been established successfully.'.bgBlue);

    // Synchronize the models with the database (alter: true means it will alter tables if they already exist)
    await sequelize.sync({
      alter: true,
      force: process.env.NODE_ENV === 'development',
      logging: false,
    });
    console.log('Models synchronized'.bgGreen);

    if (process.env.DEFAULT_DATA === 'true') {
      // Define an array of seed functions (ordered list)
      const seeds = [
        require('./seeders/faculty'),
        require('./seeders/department'),
        require('./seeders/user'),
        require('./seeders/academicYear'),
        require('./seeders/professor'),
        require('./seeders/course'),
        require('./seeders/paper'),
        require('./seeders/book'),
        require('./seeders/conference'),
        require('./seeders/community'),
        require('./seeders/settings'),
      ];

      // Execute all seed functions in parallel using Promise.all
      await Promise.all(seeds.map((seed) => seed()));
      console.log('Seeding completed successfully!'.bgGreen);
    }
  } catch (error) {
    // Handle any errors that occur during the process
    console.log('Unable to connect to the database:', error);
  }
})();

// Export the sequelize instance for use in other parts of the application
module.exports = sequelize;
