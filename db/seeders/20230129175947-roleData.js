"use strict";

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  async up(queryInterface, Sequelize) {
    const authService = require("../../lib/middleware/services/auth");
    const { Role } = require("../../models");

    await queryInterface.bulkInsert(
      "role",
      [
        {
          name: "admin",
          createdAt: Sequelize.fn("now"),
          updatedAt: Sequelize.fn("now"),
        },
        {
          name: "user",
          createdAt: Sequelize.fn("now"),
          updatedAt: Sequelize.fn("now"),
        },
      ],
      {}
    );
    const adminRole = await Role.findOne({
      where: {
        name: "admin",
      },
    });
    await queryInterface.bulkInsert(
      "user",
      [
        {
          username: "admin",
          password: authService.hashPassword(process.env.ADMINPASS),
          roleId: adminRole.id,
          createdAt: Sequelize.fn("now"),
          updatedAt: Sequelize.fn("now"),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("user", null, {});
    await queryInterface.bulkDelete("role", null, {});
  },
};
