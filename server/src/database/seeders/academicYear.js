const AcademicYear = require('../../models/academicYear');

async function seed() {
  const academicYearsData = [];

  for (let i = 2021; i <= 2024; i += 1) {
    const academicYear = {
      year: `${i}-${i + 1}`,
      active: 0, // Set the active flag to 0 by default
    };
    academicYearsData.push(academicYear);
  }

  // Set the active flag to 1 for the latest academic year
  academicYearsData[academicYearsData.length - 1].active = 1;

  const promises = academicYearsData.map(async (academicYear) => {
    try {
      const defaultAcademicYearData = {
        ...academicYear,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await AcademicYear.findOrCreate({
        where: { year: academicYear.year },
        defaults: defaultAcademicYearData,
      });
    } catch (error) {
      console.error('Error seeding course:', academicYear, error);
    }
  });

  await Promise.all(promises);
}

module.exports = seed;
