const express=require("express");
const app=express();
const port=7000;
const cors=require('cors');
const mysql=require('mysql2');
const db=require("./utils/db-connection");
const usersRouter=require("./routes/usersRouter");
const expenseRoute=require('./routes/expenseRouter');
const paymentRoute=require("./routes/paymentRouter")
const premiumRouter=require("./routes/premiumRouter");
const geminiRouter=require("./routes/geminiRouter");
const passwordRouter=require("./routes/passwordRouter");
const reportsRouter=require("./routes/reportRouter");
require("./models/expense_details");
require("./models/ForgotPasswordRequests");
require("./models/payment");
require("./models/relation");
require("./models/users_details");

app.use(cors());
app.use(express.json());
app.use(express.static('public'));
app.use(express.static("reports"));
app.use("/reports", express.static("reports"));
app.use("/user",usersRouter)
app.use('/expense',expenseRoute)
app.use('/',paymentRoute)
app.use('/premium',premiumRouter);
app.use("/password",passwordRouter);

app.use('/reports',reportsRouter);

app.use('/gemini',geminiRouter);
db.sync({force:false}).then(()=>{
    console.log('Database synced successfully.');
    app.listen(port,()=>{
        console.log(`Server is running on port ${port}`);
    });
}).catch((err)=>{
    console.error('Error syncing database:',err);
});


