const { DataTypes } = require("sequelize");
const sequelize = require("../utils/db-connection");

const Users = sequelize.define(
  "Users",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    premiumMember:{
      type:DataTypes.BOOLEAN,
    },
    totalIncome:{
      type:DataTypes.INTEGER,
      defaultValue:0
    },
    totalExpense:{
      type:DataTypes.INTEGER,
      defaultValue:0
    }
  },
  {
    freezeTableName: true,
  }
);

module.exports=Users;
