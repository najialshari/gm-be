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
    }
  }
  OrderDetail.init({
    categoryId: DataTypes.INTEGER,
    mealsId: DataTypes.INTEGER,
    qty: DataTypes.INTEGER,
    discount: DataTypes.INTEGER,
    subPrice: DataTypes.INTEGER,
    note: DataTypes.STRING,
    orderId: DataTypes.INTEGER,
    deletedAt: DataTypes.DATE,
    acceptted: DataTypes.DATE,
    preparing: DataTypes.DATE,
    delivered: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'OrderDetail',
  });
  return OrderDetail;
};