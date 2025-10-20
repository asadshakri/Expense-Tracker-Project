const {DataTypes} = require('sequelize');
const sequelize=require('../utils/db-connection');

const Expense=sequelize.define('expense',{
    id:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true,
        allowNull:false
    },
    income:{
        type:DataTypes.INTEGER,
        defaultValue:0
    },
     expenseAmount:{
        type:DataTypes.INTEGER,
        defaultValue: 0
    },
    description:{
        type:DataTypes.STRING,
        allowNull:false
    },
    category:{
        type:DataTypes.STRING,
        allowNull:false
    },
    note:{
        type:DataTypes.STRING,
        allowNull:true

    }
});

module.exports= Expense;