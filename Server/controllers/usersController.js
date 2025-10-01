
const Users=require("../models/users_details");

const addUsers= async(req,res)=>{
    try{
    const {name,email,password}=req.body;
    const userAdd= await Users.create(req.body);
    console.log("User successfully added");
    res.status(201).json(userAdd);
    }
    catch(err)
    {
        console.log("Error in adding user")
        res.status(500).json({message:err.message});
    }

};

module.exports={
    addUsers
}