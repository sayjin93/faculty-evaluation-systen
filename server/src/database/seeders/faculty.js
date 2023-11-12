const Faculty = require('../../models/faculty');

async function seed() {
  const facultyData = [
    { id: 1, key: 'FacultyOfEconomics,BusinessAndDevelopment' },
    { id: 2, key: 'FacultyOfEngineering,InformaticsAndArchitecture' },
    { id: 3, key: 'FacultyOfHumanities,EducationAndLiberalArts' },
    { id: 4, key: 'FacultyOfLaw,PoliticalScienceAndInternationalRelations' },
    { id: 5, key: 'FacultyOfMedicalTechnicalSciences' },
  ];

  const promises = facultyData.map(async (faculty) => {
    const defaultFacultyData = {
      ...faculty,
      is_deleted: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await Faculty.findOrCreate({
      where: { key: faculty.key },
      defaults: defaultFacultyData,
    });
  });

  await Promise.all(promises);
}

module.exports = seed;
