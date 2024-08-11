const { Department } = require('../models');

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

module.exports = {
  up: async () => {
    const promises = departmentData.map(async (department) => {
      try {
        const defaultDepartmentData = {
          ...department,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        const [created] = await Department.findOrCreate({
          where: { key: department.key },
          defaults: defaultDepartmentData,
        });

        if (created) {
          console.log(`Department "${department.key}" created.`);
        } else {
          console.log(`Department "${department.key}" already exists.`);
        }
      } catch (error) {
        console.error('Error seeding department:', department.key, error);
      }
    });

    await Promise.all(promises);
    console.log('Departments seeding completed.');
  },

  down: async () => {
    // Code to undo the seed, e.g., delete the department records
    await Department.destroy({
      where: {
        key: departmentData.map((department) => department.key),
      },
    });
    console.log('Departments seeding reverted.');
  },
};
