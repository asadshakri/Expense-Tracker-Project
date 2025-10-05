const apiUrl="http://localhost:7000/expense";
const paymentUrl="http://localhost:7000/paymentPage";
document.addEventListener("DOMContentLoaded", initialize);

function initialize() {
    const token=localStorage.getItem("token");
     axios.get("http://localhost:7000/user/premiumMember",{ headers:{ "Authorization": token } })
     .then((response)=>{
        if(response.data.premiumMember===true)
        {
           const premiumStatus=document.getElementById("premiumStatus");
            premiumStatus.style.display="block";
            const premium=document.getElementById("premium");
            premium.disabled= true;
            const leaderButton=document.getElementById("leaderButton")
            leaderButton.disabled=false;

        }
     }).catch(err=>console.log(err));
    
    axios.get(`${apiUrl}/fetch`,{ headers:{ "Authorization": token } })
    .then(response => {
        const expenselist = response.data;
    for(let i=0;i<expenselist.length;i++){
        display(expenselist[i]);
    }
})
    .catch(err => console.log(err));
}

function handleSubmit(event){
    event.preventDefault();
    const expenseamount=event.target.expenseamount.value;
    const description=event.target.description.value;
    const category=event.target.category.value;

    const expenseDetails={expenseamount,description,category};
    add(expenseDetails);
    const btn=document.getElementById("btn");
    btn.textContent="Add Expense";
    event.target.reset();

}

function add(expenseDetails){
    const token=localStorage.getItem("token");
    axios.post(`${apiUrl}/add`, expenseDetails,{headers:{ "Authorization": token }})
    .then(response => {
        display(response.data);
    })
    .catch(err => console.error(err));
}
function display(data){
    const ul =document.getElementById("ul");
    const li=document.createElement("li");
    li.textContent = `${data.expenseAmount}   ${data.description}   ${data.category}`;
    ul.appendChild(li);

    const deletebtn=document.createElement("button");
    deletebtn.textContent = "Delete";
    deletebtn.addEventListener("click", () => deleteData(data.id, li));
    deletebtn.style.marginLeft = "100px";
    deletebtn.style.margin="10px";
    const editbtn=document.createElement("button");
    editbtn.textContent = "Edit";
    editbtn.addEventListener("click", () => editData(data,li));
    editbtn.style.marginLeft = "10px";
    editbtn.style.margin="10px";

    li.appendChild(deletebtn);
    li.appendChild(editbtn);
}

function editData(data,listitem){

    const expenseamount=document.getElementById("expenseamount");
    const description=document.getElementById("description");
    const category=document.getElementById("category");
    expenseamount.value=data.expenseAmount;
    description.value=data.description;
    category.value=data.category;
    const btn=document.getElementById("btn");
    btn.textContent="Edit Expense";
    //const updatedexpenseDetails={expenseamount,description,category};
    deleteData(data.id,listitem);
}

function deleteData(id,listItem){
    const ul=document.getElementById("ul");
    const token=localStorage.getItem("token");
    axios.delete(`${apiUrl}/delete/${id}`,{ headers:{ "Authorization": token } })
    .then(response => {
        console.log(response.data);
        ul.removeChild(listItem);

    })
    .catch(err => console.error(err));
}


function buyPremium() {
    const token = localStorage.getItem("token");
    const popup = window.open("http://localhost:7000/paymentPage", "payment");
  
    // Listen for "ready" signal from payment page
    window.addEventListener("message", (event) => {
      if (event.origin === "http://localhost:7000" && event.data === "READY") {
        // Now payment page is ready, send token
        popup.postMessage({ token }, "http://localhost:7000");
      }
    });
  }

function addExpense(){
    const expenseForm=document.getElementById("expenseForm");
    expenseForm.style.display="block";
    const expense=document.getElementById("showExpense");
    expense.style.display="none";
    const Leaderboard=document.getElementById("showLeaderboard");
    Leaderboard.style.display="none";
}


function logout()
{
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    window.location.href="../SignupLogin/main.html"
}


function showExpense(){
    const expenseForm=document.getElementById("expenseForm");
    expenseForm.style.display="none";
    const expense=document.getElementById("showExpense");
    expense.style.display="block";
    const Leaderboard=document.getElementById("showLeaderboard");
    Leaderboard.style.display="none";
}

function showLeaderboard(){
    const ul=document.getElementById("ul_leader");
    axios.get("http://localhost:7000/premium/getLeaderboard")
    .then((response) => {
      const leaderboardData = response.data;

      // Get container
      const container = document.getElementById("ul_leader");
      container.innerHTML = ""; // clear old content

      // Create table
      const table = document.createElement("table");
      table.style.borderCollapse = "collapse";
      table.style.width = "100%";
      table.style.textAlign = "left";

      // Create table header
      const thead = document.createElement("thead");
      thead.innerHTML = `
        <tr style="background-color: #f2f2f2;">
          <th style="padding: 8px; border: 1px solid #ddd;">Rank</th>
          <th style="padding: 8px; border: 1px solid #ddd;">ID</th>
          <th style="padding: 8px; border: 1px solid #ddd;">Name</th>
          <th style="padding: 8px; border: 1px solid #ddd;">Total Expense</th>
        </tr>
      `;
      table.appendChild(thead);

      // Create table body
      const tbody = document.createElement("tbody");

      leaderboardData.forEach((user, index) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td style="padding: 8px; border: 1px solid #ddd;">${index + 1}</td>
          <td style="padding: 8px; border: 1px solid #ddd;">${user.id}</td>
          <td style="padding: 8px; border: 1px solid #ddd;">${user.name}</td>
          <td style="padding: 8px; border: 1px solid #ddd;">₹${user.totalExpense}</td>
        `;
        tbody.appendChild(tr);
      });

      table.appendChild(tbody);
      container.appendChild(table);
    })
    .catch((err) => {
      console.error("Error loading leaderboard:", err);
    });

    const expenseForm=document.getElementById("expenseForm");
    expenseForm.style.display="none";
    const expense=document.getElementById("showExpense");
    expense.style.display="none";
    const Leaderboard=document.getElementById("showLeaderboard");
    Leaderboard.style.display="block";

}


const descriptionid = document.getElementById("description");
let typingTimer;

descriptionid.addEventListener("input", () => {
  clearTimeout(typingTimer);

  typingTimer = setTimeout(() => {
    const description = descriptionid.value.trim();
    if (!description) return;

    axios.post("http://localhost:7000/gemini/suggestCategory", { description })
      .then(response => {
        const category = document.getElementById("category");
        console.log(response.data.category)
        category.value = response.data.category;
        console.log(category.value);
      })
      .catch(err => console.error(err));
  }, 1000);
});
