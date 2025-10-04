const express=require('express');
const router=express.Router();
const passwordController=require("../controllers/passwordController")

router.post("/forgotPassword",passwordController.resetPassword);

module.exports=router;