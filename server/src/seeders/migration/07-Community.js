'use strict';

const path = require('path');
const data = require(path.resolve(__dirname, 'seeds', '07-Community.json'));  // Adjust the path to 'seeds' folder

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Community', data, {
      updateOnDuplicate: ["id"]
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Community', null, {});
  }
};
