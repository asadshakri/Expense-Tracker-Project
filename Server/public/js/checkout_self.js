
document.getElementById("renderBtn").addEventListener("click", async() => {
    const cashfree = Cashfree({
        mode: "sandbox",
    });
    try{
        const token=localStorage.getItem("token");
      const response=await axios.post("http://localhost:7000/pay",{},{ headers:{ "Authorization": token } })
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

window.opener.postMessage("READY", "http://127.0.0.1:5500");

window.addEventListener("message", (event) => {
  console.log("Message received from:", event.origin);

  if (event.origin === "http://127.0.0.1:5500") {
    localStorage.setItem("token", event.data.token);
   
  }
});