'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Table extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Table.hasMany(models.Order, { foreignKey: "tableId" })
    }
  }
  Table.init({
    no: DataTypes.INTEGER,
    uuid: DataTypes.STRING,
    qrCode: DataTypes.STRING,
    isAvailable: DataTypes.BOOLEAN,
    deletedAt: DataTypes.DATE,
  }, {
    sequelize,
    tableName: "table",
    modelName: 'Table',
  });
  return Table;
};