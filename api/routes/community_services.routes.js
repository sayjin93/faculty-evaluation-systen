module.exports = (app) => {
  const community_services = require("../controllers/community_services.controller.js");
  const auth = require('../config/authenticate');
  var router = require("express").Router();

  // Create a new Community Service
  router.post("/",auth, community_services.create);

  // Retrieve all Community Services
  router.get("/",auth, community_services.findAll);

  // Retrieve all published Community Services
  router.get("/published",auth, community_services.findAllPublished);

  // Retrieve a single Community Service with id
  router.get("/:id",auth, community_services.findOne);

  // Update a Community Service with id
  router.put("/:id", auth,community_services.update);

  // Delete a Community Service with id
  router.delete("/:id",auth, community_services.delete);

  // Delete all Community Services
  router.delete("/", auth,community_services.deleteAll);

  app.use("/api/community-service", router);
};
