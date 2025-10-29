const backend_url="http://localhost:7000";

document.addEventListener("DOMContentLoaded", initialize);
let limit;
let page;
let allExpenses = [];


function initialize() {
   
    const token=localStorage.getItem("token");
    localStorage.setItem("premiumMember",false);
     axios.get(`${backend_url}/user/premiumMember`,{ headers:{ "Authorization": token } })
     .then((response)=>{
        if(response.data.premiumMember===true)
        {
           const premiumStatus=document.getElementById("premiumStatus");
            premiumStatus.style.display="block";
            const premium=document.getElementById("premium");
            premium.disabled= true;
            const leaderButton=document.getElementById("leaderButton")
            leaderButton.disabled=false;
            localStorage.setItem("premiumMember",true);

        }
     }).catch(err=>console.log(err));
    

}

function handleSubmit(event){
    event.preventDefault();
    let expenseamount=event.target.expenseamount.value;
    const description=event.target.description.value;
    let category=event.target.category.value;
    let income=event.target.income.value ;
    let note=event.target.note.value ;

    if(income=='')
      income=0;
    if(expenseamount=='')
      expenseamount=0;

    const expenseDetails={expenseamount,description,category,income,note};
    add(expenseDetails);
    const btn=document.getElementById("btn");
    btn.textContent="Add Income/Expense";
    event.target.reset();

}

function add(expenseDetails){
    const token=localStorage.getItem("token");
    axios.post(`${backend_url}/expense/add`, expenseDetails,{headers:{ "Authorization": token }})
    .then(response => {
      //  allExpenses.push(response.data)
       // display(response.data);
    })
    .catch(err => console.error(err));
}
function display(data) {
  const tbody = document.getElementById("tableBody");
  const tr = document.createElement("tr");

  
  const date = new Date(data.createdAt || Date.now()).toLocaleDateString();

  tr.innerHTML = `
    <td>${date}</td>
    <td>${data.income}</td>
    <td>${data.expenseAmount}</td>
    <td>${data.description}</td>
    <td>${data.category}</td>
    <td></td>
  `;


  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "Delete";
  deleteBtn.style.margin = "5px";
  deleteBtn.classList.add("btn", "btn-danger");
  deleteBtn.addEventListener("click", () => deleteData(data.id, tr));


  tr.lastElementChild.appendChild(deleteBtn);

  tbody.appendChild(tr);


}

/***********DELETE EXPENSE  ********************/

function deleteData(id, row) {
  const token = localStorage.getItem("token");
  axios
    .delete(`${backend_url}/expense/delete/${id}`, { headers: { Authorization: token } })
    .then((response) => {
      console.log(response.data);
      row.remove();
      const tbody = document.getElementById("tableBody");
      const tbodyLength = tbody.getElementsByTagName("tr").length;
      if(tbodyLength===0)
      {
        page=localStorage.getItem("currentPage")-1;
        localStorage.setItem("currentPage",page);
        showExpense();
      }
    })
    .catch((err) => console.error(err));
}


function buyPremium() {
    const token = localStorage.getItem("token");
    const popup = window.open(`${backend_url}/paymentPage`, "payment");
  
    // Listen for "ready" signal from payment page
    window.addEventListener("message", (event) => {
      if (event.origin === `${backend_url}` && event.data === "READY") {
        // Now payment page is ready, send token
        popup.postMessage({ token }, `${backend_url}`);
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
    const downloadedFiles=document.getElementById("downloadedFiles");
    downloadedFiles.style.display="none";
}


/***********CLEAR LOCAL STORAGE ON LOGOUT *******************/

function logout()
{
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    localStorage.removeItem("limit");
    localStorage.removeItem("currentPage");
    localStorage.removeItem("premiumMember");
    window.location.href="../SignupLogin/main.html"
}


/*****************DISPLAY EXPENSES WITH PAGINATION **************************/

function showExpense(page=localStorage.getItem("currentPage")||1){
  allExpenses = [];
  if(page==0)
    page=1;
  const rowsPerPage=document.getElementById("rowsPerPage");
  rowsPerPage.value=localStorage.getItem("limit")||1
  limit=localStorage.getItem("limit")||1;
  const tbody = document.getElementById("tableBody");
  tbody.innerHTML = "";
  const token=localStorage.getItem("token");
  axios.get(`${backend_url}/expense/fetch?page=${page}&limit=${limit}`,{ headers:{ "Authorization": token } })
  .then(response => {
      allExpenses=response.data.expenses
      const expenselist = response.data.expenses;
  for(let i=0;i<expenselist.length;i++){
      display(expenselist[i]);

      renderPagination(response.data.currentPage, response.data.totalPages);
  }


})
  .catch(err => console.log(err));
    
    const expenseForm=document.getElementById("expenseForm");
    expenseForm.style.display="none";
    const expense=document.getElementById("showExpense");
    expense.style.display="block";
    const Leaderboard=document.getElementById("showLeaderboard");
    Leaderboard.style.display="none";
}


/*****************PAGINATION ******************************/

function renderPagination(currentPage, totalPages) {


  const container = document.getElementById("pagination");
  container.innerHTML = ""; 


  const prevBtn = document.createElement("button");
  prevBtn.textContent = "« Prev";
  prevBtn.className = "btn btn-outline-dark btn-sm";
  prevBtn.disabled = currentPage === 1;
  prevBtn.onclick = () => {
    showExpense(currentPage - 1);
     localStorage.setItem("currentPage",currentPage - 1)
    }
  container.appendChild(prevBtn);

  // 1 2 3 4 5 6 ... totalPages
  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement("button");
    btn.textContent = i;
    btn.className = `btn btn-sm ${
      i === currentPage ? "btn-dark" : "btn-outline-dark"
    }`;
    btn.onclick = () => {
      showExpense(i); 
      localStorage.setItem("currentPage",i)}
    container.appendChild(btn);
  }

  const nextBtn = document.createElement("button");
  nextBtn.textContent = "Next »";
  nextBtn.className = "btn btn-outline-dark btn-sm";
  nextBtn.disabled = currentPage === totalPages;
  nextBtn.onclick = () => {
    showExpense(currentPage + 1);
     localStorage.setItem("currentPage",currentPage + 1)}
  container.appendChild(nextBtn);
}


function changeRowsPerPage(value) {
  limit = parseInt(value);
  localStorage.setItem("limit",limit)
  localStorage.setItem("currentPage",1)
  showExpense(1); // Reload first page with new limit
}


/*****************PREMIUM LEADERBOARD TABLE **************************/

function showLeaderboard(){
    
    axios.get(`${backend_url}/premium/getLeaderboard`)
    .then((response) => {
      const leaderboardData = response.data;

      const container = document.getElementById("ul_leader");
      container.innerHTML = ""; 

      const table = document.createElement("table");
      table.style.borderCollapse = "collapse";
      table.style.width = "100%";
      table.style.textAlign = "left";
      table.className="table table-striped table-bordered table-hover text-center align-middle mt-3"

      const thead = document.createElement("thead");
      thead.innerHTML = `
        <tr style="background-color: black; color: white;">
          <th class="bg-dark text-white" style="padding: 8px; border: 1px solid #ddd;">Rank</th>
          <th class="bg-dark text-white" style="padding: 8px; border: 1px solid #ddd;">Name</th>
          <th class="bg-dark text-white" style="padding: 8px; border: 1px solid #ddd;">Total Expense</th>
          <th class="bg-dark text-white" style="padding: 8px; border: 1px solid #ddd;">Total Income</th>
        </tr>
      `;
      table.appendChild(thead);

     
      const tbody = document.createElement("tbody");

      leaderboardData.forEach((user, index) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td style="padding: 8px; border: 1px solid #ddd;">${index + 1}</td>
          <td style="padding: 8px; border: 1px solid #ddd;">${user.name}</td>
          <td style="padding: 8px; border: 1px solid #ddd;">₹${user.totalExpense}</td>
          <td style="padding: 8px; border: 1px solid #ddd;">₹${user.totalIncome}</td>
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
    const downloadedFiles=document.getElementById("downloadedFiles");
    downloadedFiles.style.display="none";

}

/*****************GEMINI AUTO SELECTION OF CATEGORY ********************/

const descriptionid = document.getElementById("description");
let typingTimer;

descriptionid.addEventListener("input", () => {
  clearTimeout(typingTimer);

  typingTimer = setTimeout(() => {
    const description = descriptionid.value.trim();
    if (!description) return;

    axios.post(`${backend_url}/gemini/suggestCategory`, { description })
      .then(response => {
        const category = document.getElementById("category");
        console.log(response.data.category)
        category.value = response.data.category;
        console.log(category.value);
      })
      .catch(err => console.error(err));
  }, 1000);
});

/*************************FILTERING DATA (DAILY,WEEKLU,MONTHLY) ******************/

document.getElementById("daily").addEventListener("click", () => filterData("daily"));
document.getElementById("weekly").addEventListener("click", () => filterData("weekly"));
document.getElementById("monthly").addEventListener("click", () => filterData("monthly"));

function filterData(type) {
  const now = new Date();
  let filtered = [];

  if (type === "daily") {
    filtered = allExpenses.filter((e) => {
      const d = new Date(e.createdAt);
      return (
        d.getDate() === now.getDate() &&
        d.getMonth() === now.getMonth() &&
        d.getFullYear() === now.getFullYear()
      );
    });
  } else if (type === "weekly") {
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay()); // Sunday
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 7);

    filtered = allExpenses.filter((e) => {
      const d = new Date(e.createdAt);
      return d >= startOfWeek && d < endOfWeek;
    });
  } else if (type === "monthly") {
    filtered = allExpenses.filter((e) => {
      const d = new Date(e.createdAt);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    });
  }

  //Clear and enter filtered table
  const tbody = document.getElementById("tableBody");
  tbody.innerHTML = "";
  filtered.forEach((expense) => display(expense));
}



/*************************REPORT DOWNLOAD ************************/

const reportButton = document.getElementById("report");
reportButton.addEventListener("click", async(e)=>{
 e.preventDefault();
  const token = localStorage.getItem("token");
  if(localStorage.getItem("premiumMember")!=="true")
{
    alert("Only premium members can generate reports. Please upgrade to premium.");
    return;
}
  try {
    const res = await axios.get(`${backend_url}/reports/generate`, {
      headers: { Authorization: token },
    });

    const data = res.data;
    if (data.downloadUrl) {
      alert(`report generated successfully!`); 
      console.log("Redirecting...");
  window.open(data.downloadUrl, '_blank');

    }
    else 
    {
      alert("Error generating report");
    }
  } catch (err) {
    console.error("Error generating report:", err);
    alert("Something went wrong while generating the report.");
  }
});




/****************LIST OF DOWNLOADED REPORT **********************/
function downloadedFiles()
{
    const token = localStorage.getItem("token");
    if(localStorage.getItem("premiumMember")!=="true")
{
    alert("Only premium members can access downloaded files. Please upgrade to premium.");
    return;
}
    axios.get(`${backend_url}/premium/downloadedFiles`,{ headers:{ "Authorization": token } })
    .then((response)=>{
        const files=response.data
        const container=document.getElementById("ul_files");
        container.innerHTML="";

        if(files.length===0)
        {
            container.innerHTML="<p>No files downloaded yet.</p>";
            return;
        }

        const ul=document.createElement("ul");
        files.forEach(file=>{
            const li=document.createElement("li");
            const a=document.createElement("a");
            a.href=file.url;
            a.textContent=`Downloaded on: ${new Date(file.createdAt).toLocaleString()}`;
            a.target="_blank";
            li.appendChild(a);
            ul.appendChild(li);
        });
        container.appendChild(ul);
    })
    .catch(err=>console.log(err));


    const expenseForm=document.getElementById("expenseForm");
    expenseForm.style.display="none";
    const expense=document.getElementById("showExpense");
    expense.style.display="none";
    const Leaderboard=document.getElementById("showLeaderboard");
    Leaderboard.style.display="none";
    const downloadedFiles=document.getElementById("downloadedFiles");
    downloadedFiles.style.display="block";

}

