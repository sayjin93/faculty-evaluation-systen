'use strict';

const path = require('path');
const data = require(path.resolve(__dirname, 'seeds', '01-Settings.json'));  // Adjust the path to 'seeds' folder

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.bulkInsert('Settings', data, {
      updateOnDuplicate: ["id"]
    });
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('Settings', null, {});
  }
};
