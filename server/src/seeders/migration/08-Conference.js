'use strict';

const path = require('path');
const data = require(path.resolve(__dirname, 'seeds', '08-Conference.json'));  // Adjust the path to 'seeds' folder

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.bulkInsert('Conference', data, {
      conflictFields: ['id'],
      updateOnConflict: ["name","location","present_title","authors","dates","academic_year_id","professor_id","createdAt","updatedAt"]
    });
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('Conference', null, {});
  }
};
