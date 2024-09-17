'use strict';

const path = require('path');
const data = require(path.resolve(__dirname, 'seeds', '09-Course.json'));  // Adjust the path to 'seeds' folder

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.bulkInsert('Course', data, {
      conflictFields: ['id'],
      updateOnConflict: ["name","number","semester","week_hours","program","academic_year_id","professor_id","createdAt","updatedAt"]
    });
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('Course', null, {});
  }
};
