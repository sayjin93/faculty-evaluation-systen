module.exports = (app) => {
  const scientific_works = require("../controllers/scientific_works.controller.js");

  var router = require("express").Router();

  // Create a new Scientific Work
  router.post("/", scientific_works.create);

  // Retrieve all Scientific Works
  router.get("/", scientific_works.findAll);

  // Retrieve all published Scientific Works
  router.get("/published", scientific_works.findAllPublished);

  // Retrieve a single Scientific Work with id
  router.get("/:id", scientific_works.findOne);

  // Update a Scientific Work with id
  router.put("/:id", scientific_works.update);

  // Delete a Scientific Work with id
  router.delete("/:id", scientific_works.delete);

  // Delete all Scientific Works
  router.delete("/", scientific_works.deleteAll);

  app.use("/api/scientific_works", router);
};
