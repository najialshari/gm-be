'use strict';
const models = require("../models/index")
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('orders', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      number: {
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: "users"
          },
          key: "id"
        }
      },
      addressId: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: "addresses"
          },
          key: "id"
        }
      },
      tableId: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: "tables"
          },
          key: "id"
        }
      },
      priceTotal: {
        type: Sequelize.INTEGER
      },
      date: {
        type: Sequelize.DATE
      },
      done: {
        type: Sequelize.BOOLEAN
      },
      note: {
        type: Sequelize.STRING
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
    await queryInterface.dropTable('orders');
  }
};