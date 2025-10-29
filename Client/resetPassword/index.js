const backend_url="http://localhost:7000";

function resetLink(event)
{
    event.preventDefault();
    const email=event.target.email.value;
    axios.post(`${backend_url}/password/forgotPassword`,{email})
    .then((response)=>{
        alert(response.data.message);
        console.log("reset Link send");
    }).catch((err)=>{
        if(err.response)
        alert(err.response.data.message)
        console.log("error")});

}