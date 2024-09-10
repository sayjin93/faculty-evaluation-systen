const { Faculty } = require('../../models');

// Temp data
const facultyData = [
  { id: 1, key: 'FacultyOfEconomics,BusinessAndDevelopment' },
  { id: 2, key: 'FacultyOfEngineering,InformaticsAndArchitecture' },
  { id: 3, key: 'FacultyOfHumanities,EducationAndLiberalArts' },
  { id: 4, key: 'FacultyOfLaw,PoliticalScienceAndInternationalRelations' },
  { id: 5, key: 'FacultyOfMedicalTechnicalSciences' },
];

module.exports = {
  up: async () => {
    const promises = facultyData.map(async (faculty) => {
      try {
        const defaultFacultyData = {
          ...faculty,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        const [created] = await Faculty.findOrCreate({
          where: { key: faculty.key },
          defaults: defaultFacultyData,
        });

        if (created) {
          console.log(`Faculty "${faculty.key}" created.`);
        } else {
          console.log(`Faculty "${faculty.key}" already exists.`);
        }
      } catch (error) {
        console.error('Error seeding faculty:', faculty.key, error);
      }
    });

    await Promise.all(promises);
    console.log('Faculties seeding completed.');
  },

  down: async () => {
    // Code to undo the seed, e.g., delete the faculty records
    await Faculty.destroy({
      where: {
        key: facultyData.map((faculty) => faculty.key),
      },
    });
    console.log('Faculties seeding reverted.');
  },
};
