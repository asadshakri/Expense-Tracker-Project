const User=require("../models/users_details");
const jwt=require("jsonwebtoken");
require('dotenv').config();

const authenticate=async(req,res,next)=>{
    try{
        const token=req.header("authorization");
      
        const user=jwt.verify(token,`${process.env.TOKEN}`);
      
        const loginUser=await User.findByPk(user.userId);
        req.user=loginUser;
        next();
    }
    catch(err)
    {
        return res.status(500).json({message:err.message});
    }
        
    }
module.exports={authenticate};