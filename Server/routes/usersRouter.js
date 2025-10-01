const express=require("express");
const router=express.Router();
const addUserController=require("../controllers/usersController");

router.post("/add",addUserController.addUsers);
router.post("/login",addUserController.loginUser);

module.exports= router