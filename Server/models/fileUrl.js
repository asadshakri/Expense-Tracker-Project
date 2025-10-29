const sequelize = require("../utils/db-connection");
const {DataTypes} = require('sequelize');

const FileUrl = sequelize.define('fileUrl',{
    id:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true,
        allowNull:false
    },
    url:{
        type:DataTypes.STRING,
        allowNull:false
    },
    userId:{
        type:DataTypes.INTEGER,
        allowNull:false
    }
});

module.exports= FileUrl;