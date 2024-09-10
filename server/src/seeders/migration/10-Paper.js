'use strict';

const path = require('path');
const data = require(path.resolve(__dirname, 'seeds', '10-Paper.json'));  // Adjust the path to 'seeds' folder

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.bulkInsert('Paper', data, {
      updateOnDuplicate: ["id"]
    });
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('Paper', null, {});
  }
};
