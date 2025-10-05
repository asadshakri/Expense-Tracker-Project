const { createOrder } = require("../services/cashfreeService");
const payment = require("../models/payment");
const path = require("path");
const {cashfree} = require("../services/cashfreeService");
const user=require("../models/users_details");
const sequelize = require("../utils/db-connection");
exports.getPaymentPage = async (req, res) => {
  res.sendFile(path.join(__dirname, "../views/index.html"));
};



exports.processPayment = async (req, res) => {
  const orderId = "ORDER-" + Date.now();
  const orderAmount = 2000;
  const orderCurrency = "INR";
  const customerID = "1";
  const customerPhone = "9999999999";

  try {
    const paymentSessionId = await createOrder(
      orderId,
      orderAmount,
      orderCurrency,
      customerID,
      customerPhone
    );

    await payment.create({
      orderId,
      paymentSessionId,
      orderAmount,
      orderCurrency,
      paymentStatus: "pending",
      userId: req.user.id
    });

    res.status(200).json({ paymentSessionId, orderId});
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getPaymentStatus = async (req,res) => {
  const t=await sequelize.transaction();
  try {
    const orderId=req.params.orderId;
    const response = await cashfree.PGOrderFetchPayments(orderId);
    console.log("Order fetched successfully:", response.data);

    let getOrderResponse = response.data;

    let orderStatus;

    if (
      getOrderResponse.filter(
        (transaction) => transaction.payment_status === "SUCCESS"
      ).length > 0
    ) {
      orderStatus = "Success";
    } else if (
      getOrderResponse.filter(
        (transaction) => transaction.payment_status === "PENDING"
      ).length > 0
    ) {
      orderStatus = "Pending";
    } else {
      orderStatus = "Failure";
    }
   await payment.update({
    paymentStatus: orderStatus

   },
   {
    where:{
        orderId:orderId
    },
    transaction:t
   }
     )
    const payment_details= await payment.findOne({
      where:{
        orderId:orderId
      },transaction:t
     })
     
     if(orderStatus=="Success")
     {
     await user.update({
           premiumMember: true
     },{
     where:{
      id:payment_details.userId
     },
     transaction:t
    }
    )
  }
    await t.commit();
    res.status(200).json({orderStatus,orderId});
  } 
 

  catch (error) {
    console.log("Error:", error.response.data.message);
     await t.rollback();
    res.status(500).json({message:error.message});
  }
};
