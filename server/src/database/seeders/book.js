const Book = require('../../models/book');

async function seed() {
  const professorsCount = 11;
  const academicYearsCount = 10;

  const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

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
    'Introduction to Philosophy',
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

  const generateRandomBook = () => ({
    title: dummyBookTitles[randomInt(0, dummyBookTitles.length - 1)],
    publication_house: dummyPublicationHouses[randomInt(0, dummyPublicationHouses.length - 1)],
    publication_year: new Date(`${randomInt(2014, 2023)}-01-01`),
    academic_year_id: randomInt(1, academicYearsCount),
    professor_id: randomInt(2, professorsCount),
  });

  const booksData = Array.from({ length: 100 }, generateRandomBook);

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
