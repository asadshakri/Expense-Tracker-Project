const User=require("../models/users_details");
const Expense=require("../models/expense_details");
const sequelize=require("../utils/db-connection");

const getLeaderboard=async(req,res)=>{
    try {
       /* const leaderboard = await User.findAll({
          attributes: [
            "id",
            "name",
            [
              sequelize.fn(
                "COALESCE",
                sequelize.fn("SUM", sequelize.col("expenses.expenseAmount")),
                0
              ),
              "total_cost"
            ]
          ],
          include: [
            {
              model: Expense,
              attributes: [],
              required: false  // left join 
            }
          ],
          group: ["users.id"],
          order: [[sequelize.literal("total_cost"), "DESC"]]
        });*/

        const leaderboard=await User.findAll({
            attributes: [
                "id",
                "name",
                "totalExpense",
                "totalIncome"
            ]
        })
    
        res.status(200).json(leaderboard);
      } 
    catch(err)
    {
        res.status(500).json({message:err.message});
    }
    
}

const FileUrl=require("../models/fileUrl");

const getFileUrls=async(req,res)=>{
    try{
        const fileUrls=await FileUrl.findAll({
            where:{userId:req.user.id}
        });
        res.status(200).json(fileUrls);
    }
    catch(err){
        res.status(500).json({message:err.message});
    }
}

module.exports={
    getLeaderboard,
    getFileUrls
}