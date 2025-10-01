const express=require("express");
const app=express();
const port=7000;
const cors=require('cors');
const mysql=require('mysql2');
const db=require("./utils/db-connection");
const usersRouter=require("./routes/usersRouter");


app.use(cors());
app.use(express.json());

app.use("/user",usersRouter)

db.sync({force:false}).then(()=>{
    console.log('Database synced successfully.');
    app.listen(port,()=>{
        console.log(`Server is running on port ${port}`);
    });
}).catch((err)=>{
    console.error('Error syncing database:',err);
});


