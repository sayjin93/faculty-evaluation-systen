module.exports = (app) => {
  const academic_years = require("../controllers/academic_years.controller.js");
  const auth = require('../config/authenticate.js');
  var router = require("express").Router();

  // Create a new Academic Year
  router.post("/", auth, academic_years.create);

  // Retrieve all Academic Years
  router.get("/",auth, academic_years.findAll);

  // Retrieve all published Academic Years
  router.get("/published",auth, academic_years.findAllPublished);

  // Retrieve a single Academic Year with id
  router.get("/:id",auth, academic_years.findOne);

  // Update a Academic Year with id
  router.put("/:id",auth, academic_years.update);

  // Delete a Academic Year with id
  router.delete("/:id",auth, academic_years.delete);

  // Delete all Academic Years
  router.delete("/",auth, academic_years.deleteAll);

  app.use("/api/academic-year", router);
};
