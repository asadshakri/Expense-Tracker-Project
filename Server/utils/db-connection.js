const {Sequelize}= require("sequelize");
require("dotenv").config();
const sequelize=new Sequelize(process.env.DB_NAME,process.env.DB_USER,process.env.DB_PASSWORD,{
    host: process.env.HOST,
    dialect:process.env.DIALECT,
    logging: false,
});

(async()=>{
    try{
        await sequelize.authenticate();
        console.log("Database Connected Successfully");
    }
    catch(err)
    {
        console.log(`Error in connecting database---> ${err.message}`)
    }
})();

module.exports=sequelize;
