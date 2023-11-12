const Department = require('../../models/department');

async function seed() {
  const departmentData = [
    { id: 1, key: 'DepartmentOfEconomicsAndFinance', faculty_id: 1 },
    { id: 2, key: 'ManagementAndMarketingDepartment', faculty_id: 1 },
    { id: 3, key: 'CenterForSustainableDevelopment', faculty_id: 1 },
    { id: 4, key: 'DepartmentOfInformaticsTechnology', faculty_id: 2 },
    { id: 5, key: 'DepartmentOfEngineeringAndArchitecture', faculty_id: 2 },
    { id: 6, key: 'CenterForTechnologyDevelopmentAndInnovation', faculty_id: 2 },
    { id: 7, key: 'DepartmentOfHumanitiesAndCommunication', faculty_id: 3 },
    { id: 8, key: 'DepartmentOfPsychologyEducationAndSports', faculty_id: 3 },
    { id: 9, key: 'DepartmentOfAppliedArts', faculty_id: 3 },
    { id: 10, key: 'DepartmentOfLawSciences', faculty_id: 4 },
    { id: 11, key: 'DepartmentOfAppliedSocialSciences', faculty_id: 4 },
    { id: 12, key: 'CenterForMethodologyAndScientificResearch', faculty_id: 4 },
    { id: 13, key: 'DepartmentOfNursingAndPhysiotherapy', faculty_id: 5 },
    { id: 14, key: 'ImagingDepartment', faculty_id: 5 },
    { id: 15, key: 'PublicHealthResearchCenter', faculty_id: 5 },
  ];

  const promises = departmentData.map(async (department) => {
    const defaultDepartmentData = {
      ...department,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await Department.findOrCreate({
      where: { key: department.key },
      defaults: defaultDepartmentData,
    });
  });

  await Promise.all(promises);
}

module.exports = seed;
