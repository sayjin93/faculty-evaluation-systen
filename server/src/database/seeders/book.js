const Book = require('../../models/book');

// Temp data
const { professorsCount, academicYearsCount, randomInt } = require('./utils');

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

async function seed() {
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

      await Book.findOrCreate({
        where: {
          title: book.title,
        },
        defaults: defaultBooksData,
      });
    } catch (error) {
      console.error('Error seeding course:', book, error);
    }
  });

  await Promise.all(promises);
}

module.exports = seed;
