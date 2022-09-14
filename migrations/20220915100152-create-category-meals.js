'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('categoryMeals', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      image: {
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.STRING
      },
      price: { 
        type: Sequelize.DECIMAL 
      },
      isAvailable: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
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
      typeId: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: "mealTypes"
          },
          key: "id"
        }
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
    await queryInterface.dropTable('categoryMeals');
  }
};