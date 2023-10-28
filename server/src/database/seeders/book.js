const Book = require('../../models/book');

async function seed() {
  const booksData = [
    {
      title: 'Book 1',
      publication_house: 'SHBLSH',
      publication_year: new Date('2022-01-21'),
      academic_year_id: 1,
      professor_id: 1,
    },
    {
      title: 'Book 2',
      publication_house: 'SHBLSH',
      publication_year: new Date('2023-01-21'),
      academic_year_id: 2,
      professor_id: 1,
    },
    {
      title: 'Book 3',
      publication_house: 'Toena',
      publication_year: new Date('2023-01-23'),
      academic_year_id: 2,
      professor_id: 2,
    },
    {
      title: 'Book 4',
      publication_house: 'Random House',
      publication_year: new Date('2022-03-15'),
      academic_year_id: 1,
      professor_id: 3,
    },
    {
      title: 'Book 5',
      publication_house: 'Penguin Books',
      publication_year: new Date('2022-06-10'),
      academic_year_id: 1,
      professor_id: 4,
    },
    {
      title: 'Book 6',
      publication_house: 'Oxford University Press',
      publication_year: new Date('2022-07-20'),
      academic_year_id: 2,
      professor_id: 5,
    },
    {
      title: 'Book 7',
      publication_house: 'HarperCollins',
      publication_year: new Date('2022-08-17'),
      academic_year_id: 2,
      professor_id: 6,
    },
    {
      title: 'Book 8',
      publication_house: 'SHBLSH',
      publication_year: new Date('2022-11-12'),
      academic_year_id: 1,
      professor_id: 7,
    },
    {
      title: 'Book 9',
      publication_house: 'Random House',
      publication_year: new Date('2022-12-05'),
      academic_year_id: 1,
      professor_id: 8,
    },
    {
      title: 'Book 10',
      publication_house: 'Penguin Books',
      publication_year: new Date('2023-03-25'),
      academic_year_id: 2,
      professor_id: 10,
    },
  ];

  const promises = booksData.map(async (book) => {
    const defaultBooksData = {
      ...book,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await Book.findOrCreate({
      where: {
        title: book.title,
        academic_year_id: book.academic_year_id,
        professor_id: book.professor_id,
      },
      defaults: defaultBooksData,
    });
  });

  await Promise.all(promises);
}

module.exports = seed;
