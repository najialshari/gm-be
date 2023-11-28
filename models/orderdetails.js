'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class OrderDetail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      OrderDetail.belongsTo(models.Order, { foreignKey: "orderId" })
      OrderDetail.belongsTo(models.CategoryMeal, { foreignKey: "categoryMealsId" })
    }
  }
  OrderDetail.init({
    orderId: DataTypes.INTEGER,
    categoryMealsId: DataTypes.INTEGER,
    qty: DataTypes.INTEGER,
    subTotal: DataTypes.DECIMAL,
    discount: DataTypes.INTEGER,
    note: DataTypes.STRING,
    confirmed: DataTypes.DATE,
    prepared: DataTypes.DATE,
    delivered: DataTypes.DATE,
    deletedAt: DataTypes.DATE,
    rate: DataTypes.INTEGER
  }, {
    sequelize,
    tableName: "orderDetail",
    modelName: 'OrderDetail',
  });
  return OrderDetail;
};