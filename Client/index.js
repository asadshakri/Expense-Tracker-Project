const UserUrl="http://localhost:7000/user"

function showLogin() {
    document.getElementById("signupForm").style.display = "none";
    document.getElementById("loginForm").style.display = "block";
  }

  function showSignup() {
    document.getElementById("loginForm").style.display = "none";
    document.getElementById("signupForm").style.display = "block";
  }


  function addUser(event){
    event.preventDefault();
    const name=event.target.name.value;
    const email=event.target.email.value;
    const password=event.target.passwd.value;
    const span=document.getElementById("message1");
    span.innerHTML="";
    const userDetails={name,email,password};
    
    axios.post(`${UserUrl}/add`,userDetails).then((response)=>{
         
  
            alert(response.data.message);

    }).catch((error)=>{

      if(error.response.status=="409")
        {
          const span=document.getElementById("message1");
    
          span.innerHTML=`${error.response.data.message}`
          span.style.color="red";
        }
     else{
           console.log(error);
     }
    })
 event.target.reset();
  }