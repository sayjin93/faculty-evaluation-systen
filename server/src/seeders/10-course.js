const { Course } = require('../models');

// Temp data
const { professorsCount, academicYearsCount, randomInt } = require('../utils/seedersHelper');

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
  'C25',
];
const dummyPrograms = ['Bachelor', 'Master'];

module.exports = {
  up: async () => {
    const generateRandomCourse = (name, number) => ({
      name,
      number,
      semester: randomInt(1, 2), // Randomly choose between 1 and 2 for semester
      week_hours: randomInt(3, 4), // Randomly choose between 3 and 4 for week_hours
      program: dummyPrograms[randomInt(0, 1)], // Randomly choose between 'Bachelor' and 'Master' for program
      academic_year_id: randomInt(1, academicYearsCount), // Random academic year ID
      professor_id: randomInt(2, professorsCount + 1), // Random professor ID
    });

    // Ensure each course name gets a unique course number
    const coursesData = dummyCourseNumbers.map((number, index) => generateRandomCourse(dummyCourseNames[index % dummyCourseNames.length], number));

    const promises = coursesData.map(async (course) => {
      try {
        const defaultCourseData = {
          ...course,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        const [created] = await Course.findOrCreate({
          where: {
            number: course.number,
          },
          defaults: defaultCourseData,
        });

        if (created) {
          console.log(`Course "${course.name}" with number "${course.number}" created.`);
        } else {
          console.log(`Course "${course.name}" with number "${course.number}" already exists.`);
        }
      } catch (error) {
        console.error('Error seeding course:', course.name, error);
      }
    });

    await Promise.all(promises);
    console.log('Courses seeding completed.');
  },

  down: async () => {
    // Code to undo the seed, e.g., delete the course records
    await Course.destroy({
      where: {
        number: dummyCourseNumbers,
      },
    });
    console.log('Courses seeding reverted.');
  },
};
