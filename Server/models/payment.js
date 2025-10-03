const { DataTypes } = require("sequelize");
const sequelize = require("../utils/db-connection");

const payment = sequelize.define("payment", {
  orderId: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
  },
  paymentSessionId:{
    type:DataTypes.STRING
  },
  orderAmount: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  orderCurrency: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  paymentStatus: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  userId:{
    type: DataTypes.INTEGER
  }
});

module.exports = payment;
