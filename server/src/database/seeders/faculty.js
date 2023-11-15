const Faculty = require('../../models/faculty');

async function seed() {
  const facultyData = [
    { key: 'FacultyOfEconomics,BusinessAndDevelopment' },
    { key: 'FacultyOfEngineering,InformaticsAndArchitecture' },
    { key: 'FacultyOfHumanities,EducationAndLiberalArts' },
    { key: 'FacultyOfLaw,PoliticalScienceAndInternationalRelations' },
    { key: 'FacultyOfMedicalTechnicalSciences' },
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
