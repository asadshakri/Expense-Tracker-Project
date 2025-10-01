const sequelize=require("../utils/db-connection");
const users=require("./users_details");
const expense=require("./expense_details");

//one to many

users.hasMany(expense);
expense.belongsTo(users);

module.exports={
    users,
    expense
}
