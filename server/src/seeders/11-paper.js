const { Paper } = require('../models');

// Temp data
const { professorsCount, academicYearsCount, randomInt } = require('../utils/seedersHelper');

const dummyTitles = [
  'Advancements in Artificial Intelligence',
  'Ethical Considerations in Machine Learning',
  'Future of Quantum Computing',
  'Data Privacy and Security Measures',
  'Robotics and Automation Innovations',
  'Emerging Trends in Data Science',
  'HealthTech Breakthroughs',
  'Cybersecurity in a Digital Age',
  'Innovations in Natural Language Processing',
  'Big Data Analytics: Trends and Insights',
  'AI Implementation in Healthcare',
  'Impacts of Climate Change: A Scientific Review',
  'Societal Implications of AI in Education',
  'Future of Work: Automation and Job Market',
  'Global Health Challenges and Solutions',
  'Innovations in Renewable Energy Technologies',
  'Economic Impact of Digital Transformation',
  'Cultural Influences on Technological Adoption',
  'Advances in Medical Imaging Techniques',
  'The Future of Transportation: Smart Mobility',
];
const dummyJournals = [
  'Buletini Shkencor',
  'Some Journal',
  'Another Journal',
  'Science Journal',
  'Nature',
  'International Journal of Computer Science',
  'Journal of Artificial Intelligence Research',
  'Environmental Science and Technology',
  'Journal of Medical Ethics',
  'Journal of Business Ethics',
];

module.exports = {
  up: async () => {
    const generateRandomPaper = (title) => ({
      title,
      journal: dummyJournals[randomInt(0, dummyJournals.length - 1)],
      publication: new Date(`${randomInt(2018, 2023)}-${randomInt(1, 12)}-${randomInt(1, 28)}`), // Random date between 2018 and 2023
      academic_year_id: randomInt(1, academicYearsCount),
      professor_id: randomInt(2, professorsCount + 1),
    });

    const papersData = dummyTitles.map(generateRandomPaper);

    const promises = papersData.map(async (paper) => {
      try {
        const defaultPapersData = {
          ...paper,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        const [created] = await Paper.findOrCreate({
          where: {
            title: paper.title,
          },
          defaults: defaultPapersData,
        });

        if (created) {
          console.log(`Paper "${paper.title}" created.`);
        } else {
          console.log(`Paper "${paper.title}" already exists.`);
        }
      } catch (error) {
        console.error('Error seeding paper:', paper.title, error);
      }
    });

    await Promise.all(promises);
    console.log('Papers seeding completed.');
  },

  down: async () => {
    // Code to undo the seed, e.g., delete the paper records
    await Paper.destroy({
      where: {
        title: dummyTitles,
      },
    });
    console.log('Papers seeding reverted.');
  },
};
