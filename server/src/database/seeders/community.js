const Community = require('../../models/community');

// Temp data
const { professorsCount, academicYearsCount, randomInt } = require('./utils');

const dummyEventNames = [
  'Volunteer Day',
  'Clean-Up Campaign',
  'Food Drive',
  'Blood Donation Event',
  'Education Outreach',
  'Health Fair',
  'Environmental Workshop',
  'Community Health Checkup',
  'Art and Craft Workshop',
  'Tree Planting Initiative',
  'Cultural Festival',
  'Charity Auction',
  'Sports Day for Youth',
  'Literacy Program',
  'Senior Citizen Support',
  'Youth Mentorship Program',
  'Homeless Shelter Assistance',
  'Animal Welfare Campaign',
  'Digital Literacy Workshop',
  'Job Fair and Skill Building',
];

async function seed() {
  const generateRandomCommunity = () => ({
    event: dummyEventNames[randomInt(0, dummyEventNames.length - 1)],
    date: new Date(`${randomInt(2014, 2023)}-${randomInt(1, 12)}-${randomInt(1, 28)}`), // Random date between 2014 and 2023
    description: `Description for ${dummyEventNames[randomInt(0, dummyEventNames.length - 1)]}`,
    external: randomInt(0, 1), // Randomly choose between 0 and 1 for external value
    academic_year_id: randomInt(1, academicYearsCount), // Random academic year ID between 1 and 4
    professor_id: randomInt(2, professorsCount + 1), // Random professor ID between 2 and 10
  });

  const communitiesData = Array.from({ length: 100 }, generateRandomCommunity);

  const promises = communitiesData.map(async (community) => {
    try {
      const defaultCommunitiesData = {
        ...community,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await Community.findOrCreate({
        where: {
          event: community.event,
          academic_year_id: community.academic_year_id,
          professor_id: community.professor_id,
        },
        defaults: defaultCommunitiesData,
      });
    } catch (error) {
      console.error('Error seeding course:', community, error);
    }
  });

  await Promise.all(promises);
}

module.exports = seed;
