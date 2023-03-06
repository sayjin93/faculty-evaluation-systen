module.exports = (app) => {
  const conference = require("../controllers/conference.controller.js");

  var router = require("express").Router();

  // Create a new Conference
  router.post("/", conference.create);

  // Retrieve all Conferences
  router.get("/", conference.findAll);

  // Retrieve all published Conferences
  router.get("/published", conference.findAllPublished);

  // Retrieve a single Conference with id
  router.get("/:id", conference.findOne);

  // Update a Conference with id
  router.put("/:id", conference.update);

  // Delete a Conference with id
  router.delete("/:id", conference.delete);

  // Delete all Conferences
  router.delete("/", conference.deleteAll);

  app.use("/api/conference", router);
};
