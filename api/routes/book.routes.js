module.exports = (app) => {
  const book = require("../controllers/book.controller.js");

  var router = require("express").Router();

  // Create a new Book
  router.post("/", book.create);

  // Retrieve all Books
  router.get("/", book.findAll);

  // Retrieve all published Books
  router.get("/published", book.findAllPublished);

  // Retrieve a single Book with id
  router.get("/:id", book.findOne);

  // Update a Book with id
  router.put("/:id", book.update);

  // Delete a Book with id
  router.delete("/:id", book.delete);

  // Delete all Books
  router.delete("/", book.deleteAll);

  app.use("/api/book", router);
};
