const cashfree = Cashfree({
    mode: "sandbox",
});
document.getElementById("renderBtn").addEventListener("click", async() => {
    try{
      const response=await axios.post("http://localhost:7000/pay",{order:2})
      const paymentSessionId=response.data.paymentSessionId;
       console.log(paymentSessionId);
    let checkoutOptions = {
        paymentSessionId: paymentSessionId,
        redirectTarget: "_self",
    };
    await cashfree.checkout(checkoutOptions);
}
catch(err)
{
    console.log(err);
}
});