'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Subscriber extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Subscriber.init({
    email: DataTypes.STRING,
    deletedAt: DataTypes.DATE
  },
     {
    sequelize,
    tableName: "subscriber",
    modelName: 'Subscriber',
  });
  return Subscriber;
};