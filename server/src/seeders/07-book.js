const { Book } = require('../models');

// Temp data
const { professorsCount, academicYearsCount, randomInt } = require('../utils/seedersHelper');

const dummyBookTitles = [
  'Introduction to Computer Science',
  'History of Art',
  'Mathematics for Engineers',
  'Literary Analysis',
  'Chemical Reactions and Equations',
  'Psychology and Behavior',
  'Introduction to Philosophy',
  'Economics for Beginners',
  'Sociology: The Study of Society',
  'The Physics of Motion',
  'Environmental Science and Sustainability',
  'Creative Writing Workshop',
  'Statistics and Probability',
  'Human Anatomy and Physiology',
  'Digital Marketing Strategies',
  'Political Science: Understanding Governance',
  'Introduction to Astronomy',
  'Principles of Marketing',
  'Microbiology: The World of Microbes',
  'Artificial Intelligence and Machine Learning',
  'Fundamentals of Finance',
  'Media and Communication Studies',
  'Introduction to Psychology',
  'Applied Ethics',
  'Introduction to Economics',
];

const dummyPublicationHouses = [
  'Arbëria',
  'Camaj-Pipa',
  'Sh.B. e Librit Universitar',
  'Logoreci',
  'OMBRA GVG',
  'Onufri',
  'Apollonia',
  'Alb Paper',
  'Aferdita',
  'Albas',
  'Albin',
  'Çabej',
  'Dita 2000 sh.p.k',
  'Dita Group sh.a',
  'Dituria',
  'Dudaj',
  'Sh.B. e Librit Shkollor',
  'Erik',
  'Globus',
  'Grafon sh.p.k',
  'Ideart sh.p.k',
  'Omsca I',
  'Toena sh.p.k',
  'Uegen',
  'UET Press',
];

module.exports = {
  up: async () => {
    const generateRandomBook = (title) => ({
      title,
      publication_house: dummyPublicationHouses[randomInt(0, dummyPublicationHouses.length - 1)],
      publication_year: new Date(`${randomInt(2014, 2024)}-01-01`),
      academic_year_id: randomInt(1, academicYearsCount),
      professor_id: randomInt(2, professorsCount + 1),
    });

    const booksData = dummyBookTitles.map(generateRandomBook);

    const promises = booksData.map(async (book) => {
      try {
        const defaultBooksData = {
          ...book,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        const [created] = await Book.findOrCreate({
          where: {
            title: book.title,
          },
          defaults: defaultBooksData,
        });

        if (created) {
          console.log(`Book "${book.title}" created.`);
        } else {
          console.log(`Book "${book.title}" already exists.`);
        }
      } catch (error) {
        console.error('Error seeding book:', book.title, error);
      }
    });

    await Promise.all(promises);
    console.log('Books seeding completed.');
  },

  down: async () => {
    // Code to undo the seed, e.g., delete the book records
    await Book.destroy({
      where: {
        title: dummyBookTitles,
      },
    });
    console.log('Books seeding reverted.');
  },
};
