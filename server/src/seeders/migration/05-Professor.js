'use strict';

const path = require('path');
const data = require(path.resolve(__dirname, 'seeds', '05-Professor.json'));  // Adjust the path to 'seeds' folder

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.bulkInsert('Professor', data, {
      conflictFields: ['id'],
      updateOnConflict: ["first_name","last_name","gender","username","email","password","department_id","is_admin","is_verified","resetPasswordToken","resetPasswordExpires","verificationToken","verificationTokenExpires","createdAt","updatedAt","deletedAt"]
    });
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('Professor', null, {});
  }
};
