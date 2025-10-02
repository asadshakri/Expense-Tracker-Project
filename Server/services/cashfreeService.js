const { Cashfree, CFEnvironment } = require("cashfree-pg"); 

const cashfree = new Cashfree(CFEnvironment.SANDBOX, "TEST430329ae80e0f32e41a393d78b923034", "TESTaf195616268bd6202eeb3bf8dc458956e7192a85");

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
        "return_url": `http://localhost:7000/payment-status/${orderId}`,
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