module.exports = (app) => {
  const papers = require("../controllers/papers.controller.js");
  const auth = require("../config/authenticate");
  const router = require("express").Router();

  // Create a new Paper
  router.post("/", auth, papers.create);

  // Retrieve all Papers
  router.get("/", auth, papers.findAll);

  // Retrieve all published Papers
  router.get("/published", auth, papers.findAllPublished);

  // Retrieve a single Paper with id
  router.get("/:id", auth, papers.findOne);

  // Update a Paper with id
  router.put("/:id", auth, papers.update);

  // Delete a Paper with id
  router.delete("/:id", auth, papers.delete);

  // Delete all Papers
  router.delete("/", auth, papers.deleteAll);

  app.use("/api/papers", router);
};
