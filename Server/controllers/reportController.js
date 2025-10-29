const Expense = require("../models/expense_details");
const User=require("../models/users_details");
const sequelize = require("../utils/db-connection");
const AWS=require('aws-sdk');
require('dotenv').config();

const fs = require("fs");
const path = require("path");

const reportGenerate = async (req, res) => {
  try {
    const userId = req.user.id;
     

    const allExpenses = await Expense.findAll({
      where: { userId },
      attributes: ["id", "income", "expenseAmount", "description", "category", "createdAt"],
      order: [["createdAt", "ASC"]],
    });

    if (!allExpenses.length) {
      return res.status(404).json({ message: "No expenses found for this user." });
    }

 
    const now = new Date();
    const filterByRange = (expenses, start, end) =>
      expenses.filter((e) => {
        const d = new Date(e.createdAt);
        return d >= start && d < end;
      });

  
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endOfDay = new Date(startOfDay);
    endOfDay.setDate(startOfDay.getDate() + 1);
    const dailyExpenses = filterByRange(allExpenses, startOfDay, endOfDay);

    
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay()); 
    //startOfWeek.setHours(0, 0, 0, 0);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 7);
    const weeklyExpenses = filterByRange(allExpenses, startOfWeek, endOfWeek);

    
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    const monthlyExpenses = filterByRange(allExpenses, startOfMonth, endOfMonth);

    // Build CSV
    let csvData = "";

    const writeSection = (title, data) => {
      csvData += `=== ${title} ===\n`;
      csvData += "Date,Description,Category,Amount\n";
      if (data.length === 0) {
        csvData += "No records found\n\n";
        return;
      }
      data.forEach((e) => {
        const dateStr = new Date(e.createdAt).toISOString().split("T")[0];
        csvData += `${dateStr},"${e.description}","${e.category}",${e.expenseAmount},${e.income}\n`;
      });
      csvData += "\n\n";
    };

    writeSection("DAILY EXPENSES", dailyExpenses);
    writeSection("WEEKLY EXPENSES", weeklyExpenses);
    writeSection("MONTHLY EXPENSES", monthlyExpenses);

    const filename = `expense_report_${userId}_${Date.now()}.csv`;

    // Upload to S3
    const BUCKET_NAME = process.env.AWS_BUCKET_NAME;
    const IAM_USER_KEY = process.env.AWS_ACCESS_KEY;
    const IAM_USER_SECRET = process.env.AWS_SECRET_KEY;

    let s3Bucket=new AWS.S3({
      accessKeyId:IAM_USER_KEY,
      secretAccessKey:IAM_USER_SECRET,

    });

      var params={
        Bucket:BUCKET_NAME,
        Key:filename,
        Body:csvData,
        ACL:'public-read'
      };
      const fileUrl= await new Promise((resolve,reject)=>{
        s3Bucket.upload(params,(err,res)=>{
        if(err){
          console.log('Error in S3 upload:',err);
          reject(err);
        }
        else{
        console.log('Successfully uploaded report to S3:',res);
        resolve(res.Location);
        }
      });
    });


    // Save file URL to database
    const FileUrl = require("../models/fileUrl");
    await FileUrl.create({
      url: fileUrl,
      userId: userId
    });

   /* // Save file locally
    const reportsDir = path.join(__dirname, "../reports");
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir, { recursive: true });
    }
    
    const filename = `expense_report_${userId}_${Date.now()}.csv`;
    const filepath = path.join(reportsDir, filename);

    fs.writeFile(filepath, csvData, "utf8", (err) => {
      if (err) {
        console.error("Error writing report:", err);
      } else {
        console.log(`Report saved successfully: ${filepath}`);
      }
    });*/



    res.status(200).json({
      message: "Report generated successfully!",
      downloadUrl: fileUrl
    });
  } catch (err) {
    console.error("Error generating report:", err);
    res.status(500).json({ message: "Failed to generate report." });
  }
};

module.exports = {
     reportGenerate 
};
