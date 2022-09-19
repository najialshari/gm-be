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
      addressId: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: "addresses"
          },
          key: "id"
        }
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
      tableId: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: "tables"
          },
          key: "id"
        }
      },
      totalPrice: {
        type: Sequelize.DECIMAL
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
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('orders');
  }
};