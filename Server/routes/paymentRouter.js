const express=require('express');
const router=express.Router();

const {processPayment,getPaymentPage,getPaymentStatus}=require("../controllers/paymentController");

router.post("/pay",processPayment);
router.get("/paymentPage",getPaymentPage)
router.get("/payment-status/:orderId",getPaymentStatus)

module.exports=router;