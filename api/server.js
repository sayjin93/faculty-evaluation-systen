const express = require("express");
const cors = require("cors");
const colors = require("colors");
const dotenv = require("dotenv");

dotenv.config(); // Loads environment variables

const db = require("./models"); // Connect database

// Seed files
const seeds = [
  require("./seeders/users_seed"),
  require("./seeders/academic_year_seed"),
  require("./seeders/professors_seed"),
  require("./seeders/courses_seed"),
  require("./seeders/papers_seed"),
  require("./seeders/books_seed"),
  require("./seeders/conferences_seed"),
  require("./seeders/communities_seed"),
];

const app = express(); // Creates a new instance of the Express.js framework

// Middleware
app.use(express.json()); // parse requests of content-type - application/json
app.use(express.urlencoded({ extended: true })); // parse requests of content-type - application/x-www-form-urlencoded
app.use(cors());

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to jk WebApp." });
});

// Routes
require("./routes/academic_years.routes")(app);
require("./routes/books.routes")(app);
require("./routes/community_services.routes")(app);
require("./routes/conferences.routes")(app);
require("./routes/courses.routes")(app);
require("./routes/papers.routes")(app);
require("./routes/professors.routes")(app);
require("./routes/users.routes")(app);

db.sequelize
  .sync({ alter: true, logging: false })
  .then(async () => {
    console.log("Database synced successfully!".bgGreen);

    // Call all seed functions in sequence
    for (let i = 0; i < seeds.length; i++) {
      await seeds[i](db.sequelize.getQueryInterface(), db.Sequelize);
    }

    console.log("Seeding completed successfully!".bgGreen);
  })
  .catch((error) => {
    console.log("Error syncing database!".bgRed);
  });

// set port, listen for requests
const PORT = process.env.API_PORT || 4000;
app.listen(PORT, () => {
  console.log(colors.bgYellow("Server is running on port %s"), PORT);
});
