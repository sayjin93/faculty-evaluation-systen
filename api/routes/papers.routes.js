module.exports = (app) => {
  const papers = require("../controllers/papers.controller.js");

  var router = require("express").Router();

  // Create a new Paper
  router.post("/", papers.create);

  // Retrieve all Papers
  router.get("/", papers.findAll);

  // Retrieve all published Papers
  router.get("/published", papers.findAllPublished);

  // Retrieve a single Paper with id
  router.get("/:id", papers.findOne);

  // Update a Paper with id
  router.put("/:id", papers.update);

  // Delete a Paper with id
  router.delete("/:id", papers.delete);

  // Delete all Papers
  router.delete("/", papers.deleteAll);

  app.use("/api/papers", router);
};
