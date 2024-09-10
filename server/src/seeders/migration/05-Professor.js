'use strict';

const path = require('path');
const data = require(path.resolve(__dirname, 'seeds', '05-Professor.json'));  // Adjust the path to 'seeds' folder

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.bulkInsert('Professor', data, {
      updateOnDuplicate: ["id"]
    });
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('Professor', null, {});
  }
};
