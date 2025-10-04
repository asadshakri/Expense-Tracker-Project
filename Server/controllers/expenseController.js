const Expense = require("../models/expense_details");
const User=require("../models/users_details");
const sequelize = require("../utils/db-connection");
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

    const transaction= await sequelize.transaction();
    try{
        const {expenseamount,description,category}=req.body;
        const expenses=await Expense.create({
            expenseAmount:expenseamount,
            description:description,
            category:category,
            UserId:req.user.id
        },
            {transaction}
        )
        await User.increment(
            { totalExpense: expenseamount },
            {
              where: { id: req.user.id },
              transaction,
            }
          );
         await transaction.commit(); 
        res.status(201).json(expenses);
    }
    catch(error){
        console.error('Error adding expense:',error);
        transaction.rollback();
        res.status(500).json({message:error.message});
    }
}

const deleteexpense=async(req,res)=>{
    const transaction= await sequelize.transaction();
    try{
        const {id}=req.params;
        const expenseToDelete = await Expense.findOne({
            where: { id, UserId: req.user.id },
            attributes: ["expenseAmount"],
            transaction
          });
     const expenseAmount = expenseToDelete.expenseAmount;
     if (!expenseToDelete) {
        await transaction.rollback();
        return res.status(404).json({ message: "Expense not found" });
      }

        await Expense.destroy({
            where:{
                id:id,
                userId:req.user.id
            },
            transaction
        });

        await User.increment(
            { totalExpense: -expenseAmount }, 
            { where: { id: req.user.id },
        transaction }
          );
         await transaction.commit();
        res.status(200).json({message:'Expense deleted successfully'});
    }
    catch(error){
        console.error('Error deleting expense:',error);
       await transaction.rollback();
        res.status(500).json({message:error.message});
    }
}

module.exports={
    fetchexpenses,
    addexpense,
    deleteexpense
};