const express=require('express');
const router=express.Router();
const expenseController= require('../controllers/expenseController');
const middleware=require("../middleware/auth");

router.get('/fetch',middleware.authenticate,expenseController.fetchexpenses);
router.post('/add',middleware.authenticate,expenseController.addexpense);
router.delete('/delete/:id',middleware.authenticate,expenseController.deleteexpense);

module.exports= router