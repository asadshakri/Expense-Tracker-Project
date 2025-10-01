const express=require("express");
const router=express.Router();
const addUserController=require("../controllers/usersController");

router.post("/add",addUserController.addUsers);


module.exports= router