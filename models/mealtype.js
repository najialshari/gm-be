'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class MealType extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      MealType.hasMany(models.CategoryMeal, { foreignKey: 'typeId' })
    }
  }
  MealType.init({
    name: DataTypes.STRING,
    deletedAt: DataTypes.DATE,
  }, {
    sequelize,
    tableName: "mealType",
    modelName: 'MealType',
  });
  return MealType;
};