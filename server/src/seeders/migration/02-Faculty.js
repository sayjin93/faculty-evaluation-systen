'use strict';

const path = require('path');
const data = require(path.resolve(__dirname, 'seeds', '02-Faculty.json'));  // Adjust the path to 'seeds' folder

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.bulkInsert('Faculty', data, {
      updateOnDuplicate: ["id"]
    });
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('Faculty', null, {});
  }
};
