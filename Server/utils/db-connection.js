const {Sequelize}= require("sequelize");
const sequelize=new Sequelize("expense_db","root","Qwert@1234",{
    host:"localhost",
    dialect:"mysql"
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
