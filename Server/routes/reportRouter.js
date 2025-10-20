const express=require('express');
const router=express.Router();
const middleware=require("../middleware/auth");

const reportController= require('../controllers/reportController');

router.get('/generate',middleware.authenticate,reportController.reportGenerate);

module.exports= router