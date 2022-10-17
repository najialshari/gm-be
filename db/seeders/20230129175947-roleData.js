'use strict';
/** @type {import('sequelize-cli').Migration} */

module.exports = {

  async up(queryInterface, Sequelize) {
    const authService = require("../../lib/middleware/services/auth")
    const { Role } = require("../../models")

    await queryInterface.bulkInsert('roles', [
      { name: 'admin' },
      { name: 'user' },
    ], {});
    const adminRole = await Role.findOne({
      where: {
        name: 'admin'
      }
    })
    await queryInterface.bulkInsert('users', [
      {
        username: 'admin',
        password: authService.hashPassword(process.env.ADMINPASS),
        roleId: adminRole.id
      }
    ], {})
  },

  async down(queryInterface, Sequelize) {

    await queryInterface.bulkDelete('users', null, {});
    await queryInterface.bulkDelete('roles', null, {});

  }
};
