'use strict';

const path = require('path');
const data = require(path.resolve(__dirname, 'seeds', '08-Conference.json'));  // Adjust the path to 'seeds' folder

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.bulkInsert('Conference', data, {
      updateOnDuplicate: ["id"]
    });
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('Conference', null, {});
  }
};
