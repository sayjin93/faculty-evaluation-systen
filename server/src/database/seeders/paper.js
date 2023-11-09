const Paper = require('../../models/paper');

async function seed() {
  const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

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

  const generateRandomPaper = () => ({
    title: dummyTitles[randomInt(0, dummyTitles.length - 1)],
    journal: dummyJournals[randomInt(0, dummyJournals.length - 1)],
    publication: new Date(`${randomInt(2018, 2023)}-${randomInt(1, 12)}-${randomInt(1, 28)}`), // Random date between 2018 and 2023
    academic_year_id: randomInt(1, 10), // Random academic year ID between 1 and 10
    professor_id: randomInt(1, 10), // Random professor ID between 1 and 10
  });

  const papersData = Array.from({ length: 100 }, generateRandomPaper);

  const promises = papersData.map(async (paper) => {
    const defaultPapersData = {
      ...paper,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await Paper.findOrCreate({
      where: {
        title: paper.title,
        academic_year_id: paper.academic_year_id,
        professor_id: paper.professor_id,
      },
      defaults: defaultPapersData,
    });
  });

  await Promise.all(promises);
}

module.exports = seed;
