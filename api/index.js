const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());

// parse requests of content-type - application/json
app.use(express.json());

const db = require("./models");
db.sequelize
  .sync()
  .then(() => {
    console.log("Synced db.");
  })
  .catch((err) => {
    console.log("Failed to sync db: " + err.message);
  });

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to jk application." });
});

require("./routes/academic_years.routes")(app);
require("./routes/books.routes")(app);
require("./routes/community_services.routes")(app);
require("./routes/courses.routes")(app);
require("./routes/papers.routes")(app);
require("./routes/professors.routes")(app);
require("./routes/scientific_works.routes")(app);
require("./routes/users.routes")(app);

// set port, listen for requests
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
