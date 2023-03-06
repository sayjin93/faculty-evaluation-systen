module.exports = (app) => {
  const professors = require("../controllers/professors.controller.js");

  var router = require("express").Router();

  // Create a new Professor
  router.post("/", professors.create);

  // Retrieve all Professors
  router.get("/", professors.findAll);

  // Retrieve all published Professors
  router.get("/published", professors.findAllPublished);

  // Retrieve a single Professor with id
  router.get("/:id", professors.findOne);

  // Update a Professor with id
  router.put("/:id", professors.update);

  // Delete a Professor with id
  router.delete("/:id", professors.delete);

  // Delete all Professors
  router.delete("/", professors.deleteAll);

  app.use("/api/professors", router);
};
