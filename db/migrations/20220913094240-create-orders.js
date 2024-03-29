"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("order", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      no: {
        type: Sequelize.INTEGER,
      },
      addressId: {
        type: Sequelize.INTEGER,
        references: {
          model: "address",
          key: "id",
        },
      },
      userId: {
        type: Sequelize.INTEGER,
        references: {
          model: "user",
          key: "id",
        },
      },
      tableId: {
        type: Sequelize.INTEGER,
        references: {
          model: "table",
          key: "id",
        },
      },
      totalPrice: {
        type: Sequelize.DECIMAL(10, 2),
      },
      date: {
        type: Sequelize.DATE,
      },
      done: {
        type: Sequelize.BOOLEAN,
      },
      note: {
        type: Sequelize.STRING,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("now"),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("now"),
      },
      deletedAt: {
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("order");
  },
};
