const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

// Loads environment variables
dotenv.config();

// Connect database
const db = require("./models");
const usersSeed = require("./seeders/users_seed");
const academicYearsSeed = require("./seeders/academic_year_seed");

db.sequelize
  .sync({ alter: true })
  .then(() => {
    console.log("Database synced successfully.");

    // Call all seed functions
    return Promise.all([
      usersSeed(db.sequelize.getQueryInterface(), db.Sequelize),
      academicYearsSeed(db.sequelize.getQueryInterface(), db.Sequelize),
      // Add more seed functions here as needed...
    ]);
  })
  .then(() => {
    console.log("Seeding completed successfully.");
  })
  .catch((error) => {
    console.error("Error syncing database: ", error);
  });

// Creates a new instance of the Express.js framework and assigns it to the app constant.
const app = express();

// Middleware
app.use(express.json()); // parse requests of content-type - application/json
app.use(express.urlencoded({ extended: true })); // parse requests of content-type - application/x-www-form-urlencoded
app.use(cors());

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to jk WebApp." });
});

require("./routes/academic_years.routes")(app);
require("./routes/books.routes")(app);
require("./routes/community_services.routes")(app);
require("./routes/conferences.routes")(app);
require("./routes/courses.routes")(app);
require("./routes/papers.routes")(app);
require("./routes/professors.routes")(app);
require("./routes/users.routes")(app);

// set port, listen for requests
const PORT = process.env.API_PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
