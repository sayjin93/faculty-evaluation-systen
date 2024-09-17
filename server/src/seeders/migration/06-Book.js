'use strict';

const path = require('path');
const data = require(path.resolve(__dirname, 'seeds', '06-Book.json'));  // Adjust the path to 'seeds' folder

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.bulkInsert('Book', data, {
      conflictFields: ['id'],
      updateOnConflict: ["title","publication_house","publication_year","academic_year_id","professor_id","createdAt","updatedAt"]
    });
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('Book', null, {});
  }
};
