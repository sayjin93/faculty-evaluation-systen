const Faculty = require('../../models/faculty');

// Temp data
const facultyData = [
  { id: 1, key: 'FacultyOfEconomics,BusinessAndDevelopment' },
  { id: 2, key: 'FacultyOfEngineering,InformaticsAndArchitecture' },
  { id: 3, key: 'FacultyOfHumanities,EducationAndLiberalArts' },
  { id: 4, key: 'FacultyOfLaw,PoliticalScienceAndInternationalRelations' },
  { id: 5, key: 'FacultyOfMedicalTechnicalSciences' },
];

async function seed() {
  const promises = facultyData.map(async (faculty) => {
    try {
      const defaultFacultyData = {
        ...faculty,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await Faculty.findOrCreate({
        where: { key: faculty.key },
        defaults: defaultFacultyData,
      });
    } catch (error) {
      console.error('Error seeding course:', faculty, error);
    }
  });

  await Promise.all(promises);
}

module.exports = seed;
