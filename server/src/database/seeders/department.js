const Department = require('../../models/department');

// Temp data
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

async function seed() {
  const promises = departmentData.map(async (department) => {
    try {
      const defaultDepartmentData = {
        ...department,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await Department.findOrCreate({
        where: { key: department.key },
        defaults: defaultDepartmentData,
      });
    } catch (error) {
      console.error('Error seeding course:', department, error);
    }
  });

  await Promise.all(promises);
}

module.exports = seed;
