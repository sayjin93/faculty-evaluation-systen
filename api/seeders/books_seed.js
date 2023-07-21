"use strict";

const db = require("../models");

async function seed() {
  const booksData = [
    {
      title: "Book 1",
      publication_house: "SHBLSH",
      publication_year: new Date("2022-01-21"),
      academic_year_id: 1,
      professor_id: 1,
    },
    {
      title: "Book 2",
      publication_house: "SHBLSH",
      publication_year: new Date("2023-01-21"),
      academic_year_id: 2,
      professor_id: 1,
    },
    {
      title: "Book 3",
      publication_house: "Toena",
      publication_year: new Date("2023-01-23"),
      academic_year_id: 2,
      professor_id: 2,
    },
  ];

  for (const book of booksData) {
    const defaultBooksData = {
      ...book,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await db.books.findOrCreate({
      where: {
        title: book.title,
        academic_year_id: book.academic_year_id,
        professor_id: book.professor_id,
      },
      defaults: defaultBooksData,
    });
  }
}

module.exports = seed;
