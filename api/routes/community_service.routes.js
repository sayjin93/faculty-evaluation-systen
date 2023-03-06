module.exports = (app) => {
  const community_service = require("../controllers/community_service.controller.js");

  var router = require("express").Router();

  // Create a new Community Service
  router.post("/", community_service.create);

  // Retrieve all Community Services
  router.get("/", community_service.findAll);

  // Retrieve all published Community Services
  router.get("/published", community_service.findAllPublished);

  // Retrieve a single Community Service with id
  router.get("/:id", community_service.findOne);

  // Update a Community Service with id
  router.put("/:id", community_service.update);

  // Delete a Community Service with id
  router.delete("/:id", community_service.delete);

  // Delete all Community Services
  router.delete("/", community_service.deleteAll);

  app.use("/api/community-service", router);
};
