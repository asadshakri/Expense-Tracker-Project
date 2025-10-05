const {DataTypes} = require('sequelize');
const sequelize=require('../utils/db-connection');

const PassReqs=sequelize.define("PassReqs",{

    id:{
        type:DataTypes.STRING,
        primaryKey:true,
        allowNull:false
    },
    isActive:{
        type:DataTypes.BOOLEAN,

    }
});

module.exports= PassReqs