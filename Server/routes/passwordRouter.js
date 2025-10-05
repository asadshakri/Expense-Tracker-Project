const express=require('express');
const router=express.Router();
const passwordController=require("../controllers/passwordController")

router.post("/forgotPassword",passwordController.forgotPassword);
router.get("/resetPassword/:uuid",passwordController.resetPassword);
router.post("/updatePassword/:uuid",passwordController.updatePassword);


module.exports=router;