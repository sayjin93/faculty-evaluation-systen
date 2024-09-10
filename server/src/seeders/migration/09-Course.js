'use strict';

const path = require('path');
const data = require(path.resolve(__dirname, 'seeds', '09-Course.json'));  // Adjust the path to 'seeds' folder

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Course', data, {
      updateOnDuplicate: ["id"]
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Course', null, {});
  }
};
