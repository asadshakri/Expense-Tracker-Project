const express=require("express");
const router=express.Router();
const addUserController=require("../controllers/usersController");
const middleware=require("../middleware/auth");
router.post("/add",addUserController.addUsers);
router.post("/login",addUserController.loginUser);
router.get("/premiumMember",middleware.authenticate,addUserController.isPremiumMember);

module.exports= router