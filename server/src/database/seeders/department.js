const Department = require('../../models/department');

async function seed() {
  const departmentData = [
    { key: 'DepartmentOfEconomicsAndFinance', faculty_id: 1 },
    { key: 'ManagementAndMarketingDepartment', faculty_id: 1 },
    { key: 'CenterForSustainableDevelopment', faculty_id: 1 },
    { key: 'DepartmentOfInformaticsTechnology', faculty_id: 2 },
    { key: 'DepartmentOfEngineeringAndArchitecture', faculty_id: 2 },
    { key: 'CenterForTechnologyDevelopmentAndInnovation', faculty_id: 2 },
    { key: 'DepartmentOfHumanitiesAndCommunication', faculty_id: 3 },
    { key: 'DepartmentOfPsychologyEducationAndSports', faculty_id: 3 },
    { key: 'DepartmentOfAppliedArts', faculty_id: 3 },
    { key: 'DepartmentOfLawSciences', faculty_id: 4 },
    { key: 'DepartmentOfAppliedSocialSciences', faculty_id: 4 },
    { key: 'CenterForMethodologyAndScientificResearch', faculty_id: 4 },
    { key: 'DepartmentOfNursingAndPhysiotherapy', faculty_id: 5 },
    { key: 'ImagingDepartment', faculty_id: 5 },
    { key: 'PublicHealthResearchCenter', faculty_id: 5 },
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
