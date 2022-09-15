'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('orderDetails', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      categoryMealsMeId: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: "categoryMeals"
          },
          key: "mealId"
        }
      },
      categoryMealsCaId: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: "categoryMeals"
          },
          key: "CategoryId"
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
      confirmed: {
        type: Sequelize.DATE,
      },
      prepared: {
        type: Sequelize.DATE,
      },
      delivered: {
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
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('orderDetails');
  }
};