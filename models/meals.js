'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Meal extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Meal.hasMany(models.CategoryMeal, { foreignKey: "mealId" })
    }
  }
  Meal.init({
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    isAvailable: DataTypes.BOOLEAN,
  }, {
    sequelize,
    tableName: "meal",
    modelName: 'Meal',
  });
  return Meal;
};