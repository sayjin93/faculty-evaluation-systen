const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger_output.json");

// Loads environment variables
dotenv.config();

// Connect database
const db = require("./models");
db.sequelize
  .sync({ alter: true })
  .then(() => {
    console.log("Synced db.");
  })
  .catch((err) => {
    console.log("Failed to sync db: " + err.message);
  });

// Creates a new instance of the Express.js framework and assigns it to the app constant.
const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // parse requests of content-type - application/json
app.use(express.urlencoded({ extended: true })); // parse requests of content-type - application/x-www-form-urlencoded

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to jk application." });
});

require("./routes/academic_years.routes")(app);
require("./routes/books.routes")(app);
require("./routes/community_services.routes")(app);
require("./routes/conferences.routes")(app);
require("./routes/courses.routes")(app);
require("./routes/papers.routes")(app);
require("./routes/professors.routes")(app);
require("./routes/scientific_works.routes")(app);
require("./routes/users.routes")(app);

// Serve Swagger UI
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// set port, listen for requests
const PORT = process.env.API_PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
