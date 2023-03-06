module.exports = (app) => {
  const community_services = require("../controllers/community_services.controller.js");

  var router = require("express").Router();

  // Create a new Community Service
  router.post("/", community_services.create);

  // Retrieve all Community Services
  router.get("/", community_services.findAll);

  // Retrieve all published Community Services
  router.get("/published", community_services.findAllPublished);

  // Retrieve a single Community Service with id
  router.get("/:id", community_services.findOne);

  // Update a Community Service with id
  router.put("/:id", community_services.update);

  // Delete a Community Service with id
  router.delete("/:id", community_services.delete);

  // Delete all Community Services
  router.delete("/", community_services.deleteAll);

  app.use("/api/community-service", router);
};
