const express = require('express');
const cors = require('cors');
const colors = require('colors');
const dotenv = require('dotenv');

dotenv.config(); // Loads environment variables

const db = require('./models'); // Connect database

const app = express(); // Creates a new instance of the Express.js framework

// Middleware
app.use(express.json()); // parse requests of content-type - application/json
app.use(express.urlencoded({ extended: true })); // parse requests of content-type - application/x-www-form-urlencoded
app.use(cors());

// Endpoint route
app.get('/', (req, res) => {
  res.send('Welcome to jk WebApp.');
});

// Routes
require('./routes/academic_years.routes')(app);
require('./routes/books.routes')(app);
require('./routes/community_services.routes')(app);
require('./routes/conferences.routes')(app);
require('./routes/courses.routes')(app);
require('./routes/dashboard.routes')(app);
require('./routes/papers.routes')(app);
require('./routes/professors.routes')(app);
require('./routes/users.routes')(app);
require('./routes/reports.routes')(app);

// Syncing the database and handling the result
(async () => {
  try {
    await db.sequelize.authenticate();
    console.log('Connection has been established successfully.'.bgGreen);

    await db.sequelize.sync({ alter: true, logging: false });
    console.log('All models were synchronized successfully.'.bgGreen);

    // Seed files
    const seeds = [
      require('./seeders/users'),
      require('./seeders/academic_year'),
      require('./seeders/professors'),
      require('./seeders/courses'),
      require('./seeders/papers'),
      require('./seeders/books'),
      require('./seeders/conferences'),
      require('./seeders/community_services'),
    ];

    // Execute seeding functions concurrently

    // await Promise.all(seeds.map((seed) => seed()));

    // Call all seed functions in sequence
    for (let i = 0; i < seeds.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      await seeds[i](db.sequelize.getQueryInterface(), db.Sequelize);
    }

    console.log('Seeding completed successfully!'.bgGreen);
  } catch (error) {
    console.log('Unable to connect to the database:', error);
  }
})();
// Setting up the server to listen for requests
const PORT = process.env.API_PORT || 4000;
app.listen(PORT, () => {
  console.log(colors.bgYellow('Server is running on port %s'), PORT);
});
