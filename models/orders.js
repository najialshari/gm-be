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
      Order.belongsTo(models.Table, { foreignKey: "tableId" })
      Order.hasMany(models.OrderDetail, { foreignKey: "orderId" })
      Order.belongsTo(models.User, { foreignKey: "userId" })
      Order.belongsTo(models.Address, { foreignKey: "addressId" })
    }
  }
  Order.init({
    no: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
    addressId: DataTypes.INTEGER,
    tableId: DataTypes.INTEGER,
    totalPrice: DataTypes.DECIMAL,
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