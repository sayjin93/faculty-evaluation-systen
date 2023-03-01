const express = require("express");
const mysql = require("mysql");
const cors = require("cors");

const app = express();

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "fc",
});

db.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL database: ", err);
  } else {
    console.log("Connected to MySQL database!");
  }
});

app.use(express.json());
app.use(cors());

app.get("/users", (req, res) => {
  const sql = "SELECT * FROM users";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error querying database: ", err);
      res.status(500).send("Error querying database");
    } else {
      res.json(results);
    }
  });
});

app.post("/users", (req, res) => {
  const sql = "INSERT INTO users (`username`, `password`, `email`) VALUES (?)";
  const values = ["user2", "passw2", "email2"];

  db.query(sql, [values], (err, results) => {
    if (err) {
      console.error("Error querying database: ", err);
      res.status(500).send("Error querying database");
    } else {
      res.json(results);
    }
  });
});

app.listen(5000, () => {
  console.log("Server started on port 5000");
});
