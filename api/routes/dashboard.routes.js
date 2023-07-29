module.exports = (app) => {
  const dashboard = require("../controllers/dashboard.controller.js");
  const auth = require("../config/authenticate.js");
  const router = require("express").Router();

  // Retrieve all Papers with a specific academic_year_id and professor_id
  router.get(
    "/academic_year/:academic_year_id",
    auth,
    dashboard.findAllByAcademicYear
  );

  app.use("/api/dashboard", router);
};
