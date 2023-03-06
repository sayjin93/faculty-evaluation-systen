module.exports = (app) => {
  const conferences = require("../controllers/conferences.controller.js");

  var router = require("express").Router();

  // Create a new Conference
  router.post("/", conferences.create);

  // Retrieve all Conferences
  router.get("/", conferences.findAll);

  // Retrieve all published Conferences
  router.get("/published", conferences.findAllPublished);

  // Retrieve a single Conference with id
  router.get("/:id", conferences.findOne);

  // Update a Conference with id
  router.put("/:id", conferences.update);

  // Delete a Conference with id
  router.delete("/:id", conferences.delete);

  // Delete all Conferences
  router.delete("/", conferences.deleteAll);

  app.use("/api/conferences", router);
};
