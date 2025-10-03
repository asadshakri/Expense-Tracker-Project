const Expense = require("../models/expense_details");
const User=require("../models/users_details");
const fetchexpenses= async(req,res)=>{
    try{
        const expenses=await Expense.findAll({
            where:{
                userId:req.user.id
            }
        });
        res.status(200).json(expenses);
    }
    catch(error){
        console.error('Error fetching expenses:',error);
        res.status(500).json({message:error.message});
    }
}

const addexpense= async(req,res)=>{
    try{
        const {expenseamount,description,category}=req.body;
        const expenses=await Expense.create({
            expenseAmount:expenseamount,
            description:description,
            category:category,
            UserId:req.user.id
        })
        await User.increment(
            { totalExpense: expenseamount },
            { where: { id: req.user.id } }
          );
        res.status(201).json(expenses);
    }
    catch(error){
        console.error('Error adding expense:',error);
        res.status(500).json({message:error.message});
    }
}

const deleteexpense=async(req,res)=>{
    try{
        const {id}=req.params;
        const expenseToDelete = await Expense.findOne({
        where: { id, userId: req.user.id }
    });
     const expenseAmount = expenseToDelete.expenseAmount;

        await Expense.destroy({
            where:{
                id:id,
                userId:req.user.id
            }
        });

        await User.increment(
            { totalExpense: -expenseAmount }, 
            { where: { id: req.user.id } }
          );
        res.status(200).json({message:'Expense deleted successfully'});
    }
    catch(error){
        console.error('Error deleting expense:',error);
        res.status(500).json({message:error.message});
    }
}

module.exports={
    fetchexpenses,
    addexpense,
    deleteexpense
};