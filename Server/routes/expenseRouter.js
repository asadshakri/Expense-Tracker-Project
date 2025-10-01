const express=require('express');
const router=express.Router();
const expenseController= require('../controllers/expenseController');


router.get('/fetch',expenseController.fetchexpenses);
router.post('/add',expenseController.addexpense);
router.delete('/delete/:id',expenseController.deleteexpense);

module.exports= router