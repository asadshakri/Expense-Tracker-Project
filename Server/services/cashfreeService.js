require("dotenv").config();
const { Cashfree, CFEnvironment } = require("cashfree-pg"); 

const cashfree = new Cashfree(CFEnvironment.SANDBOX, process.env.CASHFREE_API_KEY, process.env.CASHFREE_API_SECRET);

const createOrder= async(
    orderId,
    orderAmount,
    orderCurrency="INR",
    customerID,
    customerPhone
)=>{
   try{
    
const expiryDate= new Date(Date.now() + 60*60*1000);
const orderExpiryDate=expiryDate.toISOString();
    
const request = {
    order_amount: orderAmount,
    order_currency: orderCurrency,
    order_id: orderId,
     customer_details: {
        customer_id: customerID,
        customer_phone: customerPhone
    },
    order_meta: {
        "return_url": `${process.env.PROTOCOL}://${process.env.HOST}:${process.env.PORT}/payment-status/${orderId}`,
      //  payment_methods: "cc,dc,upi"
    },

    order_expiry_time: orderExpiryDate
};

const response= await cashfree.PGCreateOrder(request)
    console.log('Order created successfully:',response.data);
    return response.data.payment_session_id;
}

catch(error){
    console.log("Cashfree Error:", error.response.data);
}
}

module.exports = {
     createOrder,
     cashfree
     };