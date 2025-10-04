const express=require('express');
const router=express.Router();
const geminiController=require("../controllers/geminiController");

router.post("/suggestCategory",geminiController.suggestCategory);

module.exports=router;