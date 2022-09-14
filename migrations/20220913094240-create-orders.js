'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('orders', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      no: {
        unique: true,
        type: Sequelize.INTEGER
      },
      addressDetail: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: "addresses"
          },
          key: "detail"
        }
      },
      addressUserId: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: "addresses"
          },
          key: "UserId"
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
        type: Sequelize.DATE,
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('orders');
  }
};