module.exports = (app) => {
  const users = require("../controllers/users.controller.js");
  
  const router = require("express").Router();

  // Create a new User
  router.post("/", users.create);

  // Retrieve all Users
  router.post("/login", users.findAll);

  // Retrieve all published Users
  router.get("/published", users.findAllPublished);

  // Retrieve a single User with id
  router.get("/:id", users.findOne);

  // Update a User with id
  router.put("/:id", users.update);

  // Delete a User with id
  router.delete("/:id", users.delete);

  // Delete all Users
  router.delete("/", users.deleteAll);

  app.use("/api/users", router);
};
