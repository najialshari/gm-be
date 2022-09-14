'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CategoryMeal extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      CategoryMeal.belongsTo(models.Meal, { foreignKey: "mealId" })
      CategoryMeal.belongsTo(models.Category, { foreignKey: "categoryId" })
      CategoryMeal.belongsTo(models.MealType, { foreignKey: "typeId" })
      CategoryMeal.hasMany(models.OrderDetail, { foreignKey: "categoryMealsId" })
    }
  }
  CategoryMeal.init({
    categoryId: DataTypes.INTEGER,
    mealId: DataTypes.INTEGER,
    isAvailable: DataTypes.BOOLEAN,
    deletedAt: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'CategoryMeal',
  });
  return CategoryMeal;
};