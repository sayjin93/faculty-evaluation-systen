module.exports = (app) => {
  const books = require("../controllers/books.controller.js");

  var router = require("express").Router();

  // Create a new Book
  router.post("/", books.create);

  // Retrieve all Books
  router.get("/", books.findAll);

  // Retrieve all published Books
  router.get("/published", books.findAllPublished);

  // Retrieve a single Book with id
  router.get("/:id", books.findOne);

  // Update a Book with id
  router.put("/:id", books.update);

  // Delete a Book with id
  router.delete("/:id", books.delete);

  // Delete all Books
  router.delete("/", books.deleteAll);

  app.use("/api/books", router);
};
