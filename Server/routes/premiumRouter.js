const express=require('express');
const router=express.Router();
const middleware=require("../middleware/auth");
const premiumFeatures=require("../controllers/premiumController");

router.get("/getLeaderboard",premiumFeatures.getLeaderboard);


module.exports=router;