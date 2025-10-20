const sequelize=require("../utils/db-connection");
const users=require("./users_details");
const expense=require("./expense_details");
const PassReqs=require("./ForgotPasswordRequests");
//one to many

users.hasMany(expense);
expense.belongsTo(users);

users.hasMany(PassReqs);
PassReqs.belongsTo(users);

module.exports={
    users,
    expense
}
