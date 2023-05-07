module.exports = (app) => {
  const conferences = require("../controllers/conferences.controller.js");
  const auth = require("../config/authenticate");
  const router = require("express").Router();

  // Create a new Conference
  router.post("/", auth, conferences.create);

  // Retrieve all Conferences
  router.get("/", auth, conferences.findAll);

  // Retrieve all published Conferences
  router.get("/published", auth, conferences.findAllPublished);

  // Retrieve a single Conference with id
  router.get("/:id", auth, conferences.findOne);

  // Update a Conference with id
  router.put("/:id", auth, conferences.update);

  // Delete a Conference with id
  router.delete("/:id", auth, conferences.delete);

  // Delete all Conferences
  router.delete("/", auth, conferences.deleteAll);

  app.use("/api/conferences", router);
};
