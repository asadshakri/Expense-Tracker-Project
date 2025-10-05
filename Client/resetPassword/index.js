

function resetLink(event)
{
    event.preventDefault();
    const email=event.target.email.value;
    axios.post("http://localhost:7000/password/forgotPassword",{email})
    .then((response)=>{
        alert(response.data.message);
        console.log("reset Link send");
    }).catch((err)=>{
        if(err.response)
        alert(err.response.data.message)
        console.log("error")});

}