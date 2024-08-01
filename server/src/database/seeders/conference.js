const Conference = require('../../models/conference');

// Temp data
const { professorsCount, academicYearsCount, randomInt } = require('./utils');

const dummyConferenceNames = [
  'International Tech Symposium',
  'Future of Artificial Intelligence Summit',
  'Global Data Science Conference',
  'AI Ethics and Innovation Forum',
  'Emerging Technologies Expo',
  'Machine Learning Showcase',
  'Digital Transformation Summit',
  'Innovations in Robotics Conference',
  'Cybersecurity and Privacy Symposium',
  'HealthTech Innovators Forum',
];
const dummyLocations = [
  'New York, USA',
  'San Francisco, USA',
  'London, UK',
  'Paris, France',
  'Tokyo, Japan',
  'Sydney, Australia',
  'Berlin, Germany',
  'Toronto, Canada',
  'Seoul, South Korea',
  'Munich, Germany',
];
const dummyPresentTitles = [
  'Advancements in AI Research',
  'Ethical Considerations in Machine Learning',
  'Future of Quantum Computing',
  'Data Privacy and Security Measures',
  'Robotics and Automation Innovations',
  'Emerging Trends in Data Science',
  'HealthTech Breakthroughs',
  'Cybersecurity in a Digital Age',
  'Innovations in Natural Language Processing',
  'Big Data Analytics: Trends and Insights',
];
const dummyAuthors = [
  'John Smith, Emily Johnson',
  'Anna Lee, David Brown',
  'Yuki Tanaka, Hiroshi Sato',
  'Sophie Martin, Pierre Lefebvre',
  'Michael Johnson, Jennifer Lee',
  'Andreas Wagner, Julia Schneider',
  'James Wilson, Emma Brown',
  'Ji-hoon Kim, Min-ji Lee',
  'Alex Johnson, Sarah Miller',
  'Petraq Papajorgji, Fatos Mustafa',
];

async function seed() {
  const generateRandomConference = (name) => ({
    name,
    location: dummyLocations[randomInt(0, dummyLocations.length - 1)],
    present_title: dummyPresentTitles[randomInt(0, dummyPresentTitles.length - 1)],
    authors: dummyAuthors[randomInt(0, dummyAuthors.length - 1)],
    dates: `20/${randomInt(1, 12)}/202${randomInt(1, 3)} - 24/${randomInt(1, 12)}/202${randomInt(1, 3)}`,
    academic_year_id: randomInt(1, academicYearsCount), // Random academic year ID between 1 and 4
    professor_id: randomInt(2, professorsCount + 1), // Random professor ID between 2 and 10
  });

  const conferencesData = dummyConferenceNames.map(generateRandomConference);

  const promises = conferencesData.map(async (conference) => {
    try {
      const defaultConferencesData = {
        ...conference,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await Conference.findOrCreate({
        where: {
          name: conference.name,
        },
        defaults: defaultConferencesData,
      });
    } catch (error) {
      console.error('Error seeding conference:', conference, error);
    }
  });

  await Promise.all(promises);
}

module.exports = seed;
