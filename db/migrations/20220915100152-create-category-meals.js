"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("categoryMeal", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      image: {
        type: Sequelize.STRING,
      },
      description: {
        type: Sequelize.STRING,
      },
      price: {
        type: Sequelize.DECIMAL(10, 2),
      },
      discount: {
        type: Sequelize.INTEGER,
      },
      isAvailable: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      categoryId: {
        type: Sequelize.INTEGER,
        references: {
          model: "category",
          key: "id",
        },
      },
      mealId: {
        type: Sequelize.INTEGER,
        references: {
          model: "meal",
          key: "id",
        },
      },
      typeId: {
        type: Sequelize.INTEGER,
        references: {
          model: "mealType",
          key: "id",
        },
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
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("categoryMeal");
  },
};
