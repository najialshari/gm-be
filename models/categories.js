'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Category.hasMany(models.CategoryMeal, { foreignKey: "categoryId" })
    }
  }
  Category.init({
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    isAvailable: DataTypes.BOOLEAN,
  }, {
    sequelize,
    tableName: "category",
    modelName: 'Category',
  });
  return Category;
};