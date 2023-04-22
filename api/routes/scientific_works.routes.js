module.exports = (app) => {
  const scientific_works = require("../controllers/scientific_works.controller.js");
  const auth = require('../config/authenticate');
  var router = require("express").Router();

  // Create a new Scientific Work
  router.post("/",auth, scientific_works.create);

  // Retrieve all Scientific Works
  router.get("/", auth,scientific_works.findAll);

  // Retrieve all published Scientific Works
  router.get("/published",auth, scientific_works.findAllPublished);

  // Retrieve a single Scientific Work with id
  router.get("/:id",auth, scientific_works.findOne);

  // Update a Scientific Work with id
  router.put("/:id",auth, scientific_works.update);

  // Delete a Scientific Work with id
  router.delete("/:id",auth, scientific_works.delete);

  // Delete all Scientific Works
  router.delete("/", auth,scientific_works.deleteAll);

  app.use("/api/scientific_works", router);
};
