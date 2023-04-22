module.exports = (app) => {
  const professors = require("../controllers/professors.controller.js");
  const auth = require('../config/authenticate');
  var router = require("express").Router();

  // Create a new Professor
  router.post("/", auth,professors.create);

  // Retrieve all Professors
  router.get("/",auth, professors.findAll);

  // Retrieve all published Professors
  router.get("/published",auth, professors.findAllPublished);

  // Retrieve a single Professor with id
  router.get("/:id",auth, professors.findOne);

  // Update a Professor with id
  router.put("/:id", auth,professors.update);

  // Delete a Professor with id
  router.delete("/:id",auth, professors.delete);

  // Delete all Professors
  router.delete("/",auth, professors.deleteAll);

  app.use("/api/professors", router);
};
