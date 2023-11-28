'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('user', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      username: {
        type: Sequelize.STRING,
        unique: true
      },
      phoneNo: {
        type: Sequelize.STRING
      },
      email: {
<<<<<<< HEAD
        type: Sequelize.STRING,
        unique: true
=======
        unique: true,
        type: Sequelize.STRING
>>>>>>> ac0a956 (Data Base)
      },
      password: {
        type: Sequelize.STRING
      },
      photo: {
        type: Sequelize.STRING
      },
      roleId: {
        type: Sequelize.INTEGER,
        references: {
          model: "role",
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
    await queryInterface.dropTable('user');
  }
};