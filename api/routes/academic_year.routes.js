module.exports = (app) => {
  const academic_year = require("../controllers/academic_year.controller.js");

  var router = require("express").Router();

  // Create a new Academic Year
  router.post("/", academic_year.create);

  // Retrieve all Academic Years
  router.get("/", academic_year.findAll);

  // Retrieve all published Academic Years
  router.get("/published", academic_year.findAllPublished);

  // Retrieve a single Academic Year with id
  router.get("/:id", academic_year.findOne);

  // Update a Academic Year with id
  router.put("/:id", academic_year.update);

  // Delete a Academic Year with id
  router.delete("/:id", academic_year.delete);

  // Delete all Academic Years
  router.delete("/", academic_year.deleteAll);

  app.use("/api/academic-year", router);
};
