
const users=require("../models/users_details")
const bcrypt=require("bcrypt");

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
    
    const saltrounds=10;
    bcrypt.hash(password,saltrounds,async(err,hash)=>{
        if(err)
        console.log(err);

        await users.create({name,email,password:hash});
        console.log("User successfully added");
        res.status(201).json({message:"user added successfully"});
    })
    
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
            res.status(404).json({message:"User not found! Create an account"});
            return;
        }
        bcrypt.compare(password,checkEmailExist.password,(err,result)=>{
            if(err)
            {
                throw new Error("Something went wrong")
            }
            if(result==true){
               res.status(200).json({message:"User login successful"});
               return;
            }
            else
            {
                res.status(401).json({message:"User not authorized! Password incorrect"});
                return;
            }
        })
           
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