'use strict';

const path = require('path');
const data = require(path.resolve(__dirname, 'seeds', '04-AcademicYear.json'));  // Adjust the path to 'seeds' folder

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.bulkInsert('AcademicYear', data, {
      updateOnDuplicate: ["id"]
    });
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('AcademicYear', null, {});
  }
};