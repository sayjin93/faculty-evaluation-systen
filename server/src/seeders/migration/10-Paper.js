'use strict';

const path = require('path');
const data = require(path.resolve(__dirname, 'seeds', '10-Paper.json'));  // Adjust the path to 'seeds' folder

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.bulkInsert('Paper', data, {
      conflictFields: ['id'],
      updateOnConflict: ["title","journal","publication","academic_year_id","professor_id","createdAt","updatedAt"]
    });
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('Paper', null, {});
  }
};
