'use strict';
const models = require("../models/index")
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('categoryMeals', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      categoryId: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: "categories"
          },
          key: "id"
        }
      },
      mealId: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: "meals"
          },
          key: "id"
        }
      },
      isAvailable: {
        type: Sequelize.BOOLEAN
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
    await queryInterface.dropTable('categoryMeals');
  }
};