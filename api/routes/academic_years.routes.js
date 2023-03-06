module.exports = (app) => {
  const academic_years = require("../controllers/academic_years.controller.js");

  var router = require("express").Router();

  // Create a new Academic Year
  router.post("/", academic_years.create);

  // Retrieve all Academic Years
  router.get("/", academic_years.findAll);

  // Retrieve all published Academic Years
  router.get("/published", academic_years.findAllPublished);

  // Retrieve a single Academic Year with id
  router.get("/:id", academic_years.findOne);

  // Update a Academic Year with id
  router.put("/:id", academic_years.update);

  // Delete a Academic Year with id
  router.delete("/:id", academic_years.delete);

  // Delete all Academic Years
  router.delete("/", academic_years.deleteAll);

  app.use("/api/academic-year", router);
};
