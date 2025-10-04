

function resetLink(event)
{
    event.preventDefault();
    const email=event.target.email.value;
    axios.post("http://localhost:7000/password/forgotPassword",{email})
    .then((response)=>{
        console.log("password changed");
    }).catch(err=>console.log("error"));




}