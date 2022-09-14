'use strict';
const models = require("../models/index")
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('orderDetails', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      categoryMealsId: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: "categoryMeals"
          },
          key: "id"
        }
      },
      qty: {
        type: Sequelize.INTEGER
      },
      discount: {
        type: Sequelize.INTEGER
      },
      subPrice: {
        type: Sequelize.INTEGER
      },
      note: {
        type: Sequelize.STRING
      },
      orderId: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: "orders"
          },
          key: "id"
        }
      },
      acceptted: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      preparing: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      delivered: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("now")

      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("now")
      },
      deletedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('orderDetails');
  }
};