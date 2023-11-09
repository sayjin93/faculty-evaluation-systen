const Course = require('../../models/course');

async function seed() {
  const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

  const dummyCourseNames = [
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

  const dummyCourseNumbers = [
    'C1',
    'C2',
    'C3',
    'C4',
    'C5',
    'C6',
    'C7',
    'C8',
    'C9',
    'C10',
    'C11',
    'C12',
    'C13',
    'C14',
    'C15',
    'C16',
    'C17',
    'C18',
    'C19',
    'C20',
    'C21',
    'C22',
    'C23',
    'C24',
  ];

  const dummyPrograms = ['Bachelor', 'Master'];

  const generateRandomCourse = () => ({
    name: dummyCourseNames[randomInt(0, dummyCourseNames.length - 1)],
    number: dummyCourseNumbers[randomInt(0, dummyCourseNumbers.length - 1)],
    semester: randomInt(1, 2), // Randomly choose between 1 and 2 for semester
    week_hours: randomInt(3, 4), // Randomly choose between 3 and 4 for week_hours
    program: dummyPrograms[randomInt(0, 1)], // Randomly choose between 'Bachelor' and 'Master' for program
    academic_year_id: randomInt(1, 10), // Random academic year ID between 1 and 10
    professor_id: randomInt(1, 10), // Random professor ID between 1 and 10
  });

  const coursesData = Array.from({ length: 100 }, generateRandomCourse);

  const promises = coursesData.map(async (course) => {
    const defaultCourseData = {
      ...course,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await Course.findOrCreate({
      where: {
        name: course.name,
        number: course.number,
        academic_year_id: course.academic_year_id,
        professor_id: course.professor_id,
      },
      defaults: defaultCourseData,
    });
  });

  await Promise.all(promises);
}

module.exports = seed;
