'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Order.init({
    no: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
    addressId: DataTypes.INTEGER,
    tableId: DataTypes.INTEGER,
    priceTotal: DataTypes.INTEGER,
    date: DataTypes.DATE,
    done: DataTypes.BOOLEAN,
    note: DataTypes.STRING,
    deletedAt: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Order',
  });
  return Order;
};