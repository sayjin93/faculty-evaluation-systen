module.exports = (app) => {
  const professor = require("../controllers/professor.controller.js");

  var router = require("express").Router();

  // Create a new Professor
  router.post("/", professor.create);

  // Retrieve all Professors
  router.get("/", professor.findAll);

  // Retrieve all published Professors
  router.get("/published", professor.findAllPublished);

  // Retrieve a single Professor with id
  router.get("/:id", professor.findOne);

  // Update a Professor with id
  router.put("/:id", professor.update);

  // Delete a Professor with id
  router.delete("/:id", professor.delete);

  // Delete all Professors
  router.delete("/", professor.deleteAll);

  app.use("/api/professor", router);
};
