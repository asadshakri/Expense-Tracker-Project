const Expense = require("../models/expense_details");
const User=require("../models/users_details");
const sequelize = require("../utils/db-connection");
const fetchexpenses= async(req,res)=>{

  let page = parseInt(req.query.page)
  let limit = parseInt(req.query.limit)
  let offset = (page - 1) * limit;
  try {
    const { count, rows } = await Expense.findAndCountAll({
      where: { UserId:req.user.id },
      order: [["createdAt", "DESC"]],
      limit: limit,
      offset: offset,
    });

    res.status(200).json({
      expenses: rows,
      currentPage: page,
      totalPages: Math.ceil(count / limit),
      totalExpenses: count,
    });
    }
    catch(error){
        console.error('Error fetching expenses:',error);
        res.status(500).json({message:error.message});
    }
}

const addexpense= async(req,res)=>{

    const transaction= await sequelize.transaction();
    try{
        const {income,expenseamount,description,category,note}=req.body;
        const expenses=await Expense.create({
            income:income,
            expenseAmount:expenseamount,
            description:description,
            category:category,
            UserId:req.user.id,
            note:note
        },
            {transaction:transaction}
        )
        await User.increment(
            { totalExpense: expenseamount,
                totalIncome: income
             },
            {
              where: { id: req.user.id },
              transaction:transaction,
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
            attributes: ["expenseAmount","income"],
            transaction:transaction
          });
     const expenseAmount = expenseToDelete.expenseAmount;
     const income = expenseToDelete.income;
     if (!expenseToDelete) {
        await transaction.rollback();
        return res.status(404).json({ message: "Expense not found" });
      }

        await Expense.destroy({
            where:{
                id:id,
                userId:req.user.id
            },
            transaction:transaction
        });

        await User.increment(
            { totalExpense: -expenseAmount,
                totalIncome:-income
             }, 
            { where: { id: req.user.id },
        transaction:transaction }
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