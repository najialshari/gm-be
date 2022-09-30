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
    image: DataTypes.STRING,
    description: DataTypes.STRING,
    price: DataTypes.DECIMAL,
    discount: DataTypes.INTEGER, 
    categoryId: DataTypes.INTEGER,
    mealId: DataTypes.INTEGER,
    typeId: DataTypes.INTEGER,
    isAvailable: DataTypes.BOOLEAN,
  }, {
    sequelize,
    modelName: 'CategoryMeal',
  });
  return CategoryMeal;
};