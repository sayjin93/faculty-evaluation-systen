const AcademicYear = require('../../models/academicYear');

async function seed() {
  const academicYearsData = [];

  for (let i = 2023; i >= 2014; i -= 1) {
    const academicYear = {
      year: `${i}-${i + 1}`,
      active: 0, // Set the active flag to 0 by default
    };
    academicYearsData.push(academicYear);
  }

  // Set the active flag to 1 for the latest academic year
  academicYearsData[0].active = 1;

  const promises = academicYearsData.map(async (academicYear) => {
    const defaultAcademicYearData = {
      ...academicYear,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await AcademicYear.findOrCreate({
      where: { year: academicYear.year },
      defaults: defaultAcademicYearData,
    });
  });

  await Promise.all(promises);
}

module.exports = seed;
