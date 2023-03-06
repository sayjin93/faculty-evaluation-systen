const express = require("express");
const cors = require("cors");

const app = express();

// var corsOptions = {
//   origin: "http://localhost:4000",
// };

app.use(cors());

// parse requests of content-type - application/json
app.use(express.json());

const db = require("./models");
db.sequelize
  .sync()
  // .sync({ force: true })
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

require("./routes/academic_year.routes")(app);
require("./routes/book.routes")(app);
require("./routes/community_service.routes")(app);
require("./routes/professor.routes")(app);

// set port, listen for requests
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

// app.get("/users", (req, res) => {
//   const sql = "SELECT * FROM users";
//   db.query(sql, (err, results) => {
//     if (err) {
//       console.error("Error querying database: ", err);
//       res.status(500).send("Error querying database");
//     } else {
//       res.json(results);
//     }
//   });
// });
// app.post("/users", (req, res) => {
//   const sql = "INSERT INTO users (`username`, `password`, `email`) VALUES (?)";
//   const values = ["user2", "passw2", "email2"];

//   db.query(sql, [values], (err, results) => {
//     if (err) {
//       console.error("Error querying database: ", err);
//       res.status(500).send("Error querying database");
//     } else {
//       res.json(results);
//     }
//   });
// });

// app.get("/professors", (req, res) => {
//   const sql = "SELECT * FROM professor";
//   db.query(sql, (err, results) => {
//     if (err) {
//       console.error("Error querying database: ", err);
//       res.status(500).send("Error querying database");
//     } else {
//       res.json(results);
//     }
//   });
// });

// app.get("/courses", (req, res) => {
//   const sql = "SELECT * FROM course";
//   db.query(sql, (err, results) => {
//     if (err) {
//       console.error("Error querying database: ", err);
//       res.status(500).send("Error querying database");
//     } else {
//       res.json(results);
//     }
//   });
// });

// app.get("/papers", (req, res) => {
//   const sql = "SELECT * FROM paper";
//   db.query(sql, (err, results) => {
//     if (err) {
//       console.error("Error querying database: ", err);
//       res.status(500).send("Error querying database");
//     } else {
//       res.json(results);
//     }
//   });
// });

// app.get("/books", (req, res) => {
//   const sql = "SELECT * FROM book";
//   db.query(sql, (err, results) => {
//     if (err) {
//       console.error("Error querying database: ", err);
//       res.status(500).send("Error querying database");
//     } else {
//       res.json(results);
//     }
//   });
// });

// app.get("/conferences", (req, res) => {
//   const sql = "SELECT * FROM conference";
//   db.query(sql, (err, results) => {
//     if (err) {
//       console.error("Error querying database: ", err);
//       res.status(500).send("Error querying database");
//     } else {
//       res.json(results);
//     }
//   });
// });

// app.get("/community", (req, res) => {
//   const sql = "SELECT * FROM community_services";
//   db.query(sql, (err, results) => {
//     if (err) {
//       console.error("Error querying database: ", err);
//       res.status(500).send("Error querying database");
//     } else {
//       res.json(results);
//     }
//   });
// });
