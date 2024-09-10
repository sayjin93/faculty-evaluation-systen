const { Conference } = require('../../models');

// Temp data
const { professorsCount, academicYearsCount, randomInt } = require('../../utils/seedersHelper');

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
  'Blockchain and Cryptocurrency Conference',
  'Sustainable Energy and Technology Summit',
  'Quantum Computing Forum',
  'Next-Gen Cloud Computing Conference',
  'Autonomous Vehicles and Mobility Expo',
  'Smart Cities and Urban Innovation Summit',
  'Wearable Technology Conference',
  'Advanced Analytics and Big Data Symposium',
  'Bioinformatics and Computational Biology Conference',
  'Virtual and Augmented Reality Expo',
  'FinTech Innovations Summit',
  'EdTech and Digital Learning Forum',
  'IoT and Connected Devices Conference',
  'Global Supply Chain Technology Summit',
  'Space Exploration and Technology Conference',
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
  'Tirana, Albania',
  'Pristina, Kosova',
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
  'Carlos Mendoza, Lucia Garcia',
  'Elena Petrova, Ivan Ivanov',
  'Maria Rossi, Giuseppe Bianchi',
  'Hans Müller, Claudia Schmidt',
  'Wei Zhang, Lian Wang',
  'Ahmed Khan, Fatima Ahmed',
  'Lucas Silva, Maria Oliveira',
  'Seung-hyun Park, Ji-eun Kim',
  'Olga Smirnova, Dmitry Petrov',
  'Aarav Patel, Priya Sharma',
  'Liam O’Connor, Aoife Murphy',
  'Jean Dupont, Isabelle Martin',
  'Nina Kovalenko, Sergey Kuznetsov',
  'Ingrid Svensson, Lars Johansson',
  'David Evans, Sophia Thompson',
];

module.exports = {
  up: async () => {
    const generateRandomConference = (name) => ({
      name,
      location: dummyLocations[randomInt(0, dummyLocations.length - 1)],
      present_title: dummyPresentTitles[randomInt(0, dummyPresentTitles.length - 1)],
      authors: dummyAuthors[randomInt(0, dummyAuthors.length - 1)],
      dates: `20/${randomInt(1, 12)}/202${randomInt(1, 3)} - 24/${randomInt(1, 12)}/202${randomInt(1, 3)}`,
      academic_year_id: randomInt(1, academicYearsCount),
      professor_id: randomInt(2, professorsCount + 1),
    });

    const conferencesData = dummyConferenceNames.map(generateRandomConference);

    const promises = conferencesData.map(async (conference) => {
      try {
        const defaultConferencesData = {
          ...conference,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        const [created] = await Conference.findOrCreate({
          where: {
            name: conference.name,
          },
          defaults: defaultConferencesData,
        });

        if (created) {
          console.log(`Conference "${conference.name}" created.`);
        } else {
          console.log(`Conference "${conference.name}" already exists.`);
        }
      } catch (error) {
        console.error('Error seeding conference:', conference.name, error);
      }
    });

    await Promise.all(promises);
    console.log('Conferences seeding completed.');
  },

  down: async () => {
    // Code to undo the seed, e.g., delete the conference records
    await Conference.destroy({
      where: {
        name: dummyConferenceNames,
      },
    });
    console.log('Conferences seeding reverted.');
  },
};
