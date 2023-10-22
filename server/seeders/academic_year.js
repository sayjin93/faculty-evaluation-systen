const db = require('../models');

async function seed() {
  const academicYearsData = [
    {
      year: '2021-2022',
      active: 0,
    },
    {
      year: '2022-2023',
      active: 1,
    },
  ];

  const promises = academicYearsData.map(async (academicYear) => {
    const defaultAcademicYearData = {
      ...academicYear,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await db.academic_years.findOrCreate({
      where: { year: academicYear.year },
      defaults: defaultAcademicYearData,
    });
  });

  await Promise.all(promises);
}

module.exports = seed;