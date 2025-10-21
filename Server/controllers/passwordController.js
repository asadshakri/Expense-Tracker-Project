const Sib = require("sib-api-v3-sdk");
const { v4 } =require('uuid');
const passReqs=require("../models/ForgotPasswordRequests");
const User=require("../models/users_details");
const path=require("path")
const bcrypt=require("bcrypt")
const sequelize=require("../utils/db-connection");
require("dotenv").config();

const forgotPassword = async (req, res) => {
  const transaction=await sequelize.transaction();
  try {
    const uuid=v4();
    const { email } = req.body;

    const user=await User.findOne({
      where:{email:email},
      attributes:["id"],
      transaction:transaction
    });
    if(!user)
      res.status(404).json({message:"User not found"});

  
    const client = Sib.ApiClient.instance;
    const apiKey = client.authentications["api-key"];
    apiKey.apiKey = process.env.BREVO_API_KEY;
   // console.log(apiKey.apiKey);
    const tranEmailApi = new Sib.TransactionalEmailsApi();

    const sender = {
      email: "asadshakri3127@gmail.com",
      name: "Expense Tracker",
    };

    const receivers = [
      {
        email: email,
      },
    ];

    const response = await tranEmailApi.sendTransacEmail({
      sender,
      to: receivers,
      subject: "Password Reset link",
      htmlContent: `
      <h3>Password Reset Request</h3>
      <p>Click below to reset your password:</p>
      <a href="${process.env.PROTOCOL}://${process.env.HOST}:${process.env.PORT}/password/resetPassword/${uuid}">
        Reset Password
      </a>`
    });

    await passReqs.create({
      id:uuid,
      isActive: true,
      UserId:user.id

    },{transaction:transaction})
    console.log(response);
     await transaction.commit();
    res.status(200).json({message:" Reset link sent"});
  } catch (err) {
    console.log(err);
    await transaction.rollback();
    res.status(500).json(err);
  }
};


const resetPassword=async(req,res)=>{
  try{
     const uuid=req.params.uuid;
     const uuidExist=await passReqs.findByPk(uuid)

     if (!uuidExist) {
      return res.status(404).json({message:"Invalid link"});
    }
    if(uuidExist.isActive===false)
    {
      return res.status(404).json({message:"Expired link"});
    }

    res.sendFile(path.join(__dirname, "../views/resetPassword.html"));
  } catch (err) {
    console.error(err);
    res.status(500).json({message:"Internal Server Error"});
  }
};


const updatePassword = async (req, res) => {
  const transaction=await sequelize.transaction();
  try {
    const uuid = req.params.uuid;
    const { newPassword } = req.body;

    const request = await passReqs.findByPk(uuid);
    if (!request || !request.isActive)
      return res.status(400).json({message:"Invalid or expired link"});

    const user = await User.findByPk(request.UserId);
    if (!user) return res.status(404).json({message:"User not found"});

    const hash = await bcrypt.hash(newPassword, 10);

    await user.update(
      { password: hash },
      { transaction: transaction }
    );
    
    await request.update(
      { isActive: false },
      { transaction: transaction }
    );
    transaction.commit();
    res.status(200).json({message:"Password reset successful!"});
  } catch (err) {
    console.error(err);
    transaction.rollback()
    res.status(500).json({message:"Internal Server Error"});
  }
};
module.exports = {
  forgotPassword,
  resetPassword,
  updatePassword
};
