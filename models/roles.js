"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Role extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Role.hasMany(models.User, { foreignKey: "roleId" });
    }
  }
  Role.init(
    {
      name: DataTypes.STRING,
      deletedAt: DataTypes.DATE,
    },
    {
      sequelize,
      tableName: "role",
      modelName: "Role",
    }
  );
  
  return Role;
};

// sequelize-cli model:generate --name meals --attributes name:string,image:string,description:string,price:integer,rate:INTEGER,isAvailable:boolean,
