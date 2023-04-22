module.exports = (app) => {
  const books = require("../controllers/books.controller.js");
  const auth = require('../config/authenticate');
  var router = require("express").Router();

  // Create a new Book
  router.post("/",auth, books.create);

  // Retrieve all Books
  router.get("/",auth, books.findAll);

  // Retrieve all published Books
  router.get("/published",auth, books.findAllPublished);

  // Retrieve a single Book with id
  router.get("/:id",auth, books.findOne);

  // Update a Book with id
  router.put("/:id",auth, books.update);

  // Delete a Book with id
  router.delete("/:id",auth, books.delete);

  // Delete all Books
  router.delete("/",auth, books.deleteAll);

  app.use("/api/books",auth, router);
};
