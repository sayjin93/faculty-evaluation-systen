const { Community } = require('../models');

// Temp data
const { professorsCount, academicYearsCount, randomInt } = require('../utils/seedersHelper');

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
  'Neighborhood Watch Program',
  'Disaster Relief Fundraiser',
  'Clothing Donation Drive',
  'Mental Health Awareness Day',
  'Gardening and Urban Farming Workshop',
  'Recycling Drive',
  'Public Safety Awareness Campaign',
  'Free Legal Aid Clinic',
  'Community Talent Show',
  'Water Conservation Workshop',
];

module.exports = {
  up: async () => {
    const generateRandomCommunity = (event) => ({
      event,
      date: new Date(`${randomInt(2014, 2023)}-${randomInt(1, 12)}-${randomInt(1, 28)}`), // Random date between 2014 and 2023
      description: `Description for ${event}`,
      external: !!randomInt(0, 1), // Randomly choose between true and false for external value
      academic_year_id: randomInt(1, academicYearsCount), // Random academic year ID
      professor_id: randomInt(2, professorsCount + 1), // Random professor ID
    });

    const communitiesData = dummyEventNames.map(generateRandomCommunity);

    const promises = communitiesData.map(async (community) => {
      try {
        const defaultCommunitiesData = {
          ...community,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        const [created] = await Community.findOrCreate({
          where: {
            event: community.event,
          },
          defaults: defaultCommunitiesData,
        });

        if (created) {
          console.log(`Community event "${community.event}" created.`);
        } else {
          console.log(`Community event "${community.event}" already exists.`);
        }
      } catch (error) {
        console.error('Error seeding community:', community.event, error);
      }
    });

    await Promise.all(promises);
    console.log('Community events seeding completed.');
  },

  down: async () => {
    // Code to undo the seed, e.g., delete the community records
    await Community.destroy({
      where: {
        event: dummyEventNames,
      },
    });
    console.log('Community events seeding reverted.');
  },
};
