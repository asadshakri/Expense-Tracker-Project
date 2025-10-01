
const users=require("../models/users_details")

const addUsers= async(req,res)=>{
    try{
    const {name,email,password}=req.body;
    const checkEmailExist=await users.findOne({
        where:{
            email:email
        }
    })
    if(checkEmailExist)
    {
        res.status(409).json({message:"User with this email is already registered"});
        return;
    }
    
    const userAdd= await users.create(req.body);

    console.log("User successfully added");
    res.status(201).json({message:"user added successfully"});
    }
    catch(err)
    {
        console.log("Error in adding user")
        res.status(500).json({message:err.message});
    }

};

const loginUser=async(req,res)=>{
    try{
        const {email,password}=req.body;
        const checkEmailExist=await users.findOne({
            where:{
                email:email
            }
        })
        if(!checkEmailExist)
        {
            res.status(404).json({message:"User not found"});
            return;
        }
        if(checkEmailExist.password===password)    //sequelize allow access directly 
        {
            res.status(200).json({message:"User login successful"});
            return;
        }
        else
        {
            res.status(401).json({message:"User not authorized"});
            return;
        }

    }
    catch(err)
    {
        res.status(500).json({message:err.message});
    }
}

module.exports={
    addUsers,
    loginUser
}