'use strict';

const path = require('path');
const data = require(path.resolve(__dirname, 'seeds', '03-Department.json'));  // Adjust the path to 'seeds' folder

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Department', data, {
      updateOnDuplicate: ["id"]
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Department', null, {});
  }
};
