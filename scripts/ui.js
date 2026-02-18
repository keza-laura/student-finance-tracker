// Wait until the page loads
document.addEventListener("DOMContentLoaded", function () {

  console.log("App is ready");

  const form = document.getElementById("transaction-form");
  const statusMessage = document.getElementById("status-message");
  const statusText = document.getElementById("status-text");

  // Function to show messages (error or success)
  function showMessage(message, isError = false) {
    statusMessage.style.display = "block";
    statusText.textContent = message;

    if (isError) {
      statusMessage.style.color = "red";
    } else {
      statusMessage.style.color = "green";
    }
  }

  // When form is submitted
  form.addEventListener("submit", function (event) {

    event.preventDefault(); // Stop page refresh

    // Get input values
    const description = document.getElementById("description").value.trim();
    const amount = document.getElementById("amount").value.trim();
    const category = document.getElementById("category").value;
    const date = document.getElementById("date").value;

    // Validation
    if (description === "") {
      showMessage("Please enter a description.", true);
      return;
    }

    if (amount === "" || Number(amount) <= 0) {
      showMessage("Please enter a valid amount greater than 0.", true);
      return;
    }

    if (category === "") {
      showMessage("Please choose a category.", true);
      return;
    }

    if (date === "") {
      showMessage("Please select a date.", true);
      return;
    }

    // Create transaction object and add to in-memory array
    const transaction = {
      id: `txn_${++counter}`,
      description,
      amount: parseFloat(amount),
      category,
      date
    };

    transactionArr.push(transaction);
    
    addToTable(transaction);
    addtodashboard();


    // Clear form
    form.reset(); 
    
    // If all validations pass
    showMessage("Transaction added successfully!");

  });

});

let transactionArr = []; 
// This array will hold all the transaction records in memory.
let counter = 0;


// add to table
function addToTable(transaction) {
  const tableBody = document.getElementById("tbody");
  const newRow = document.createElement("tr");
  //the id is generated using a counter to ensure uniqueness for each transaction record.

 
  //let id = `txn_${++counter}`;


  newRow.innerHTML = `
    <td>${transaction.id}</td>
    <td>${transaction.description}</td>
    <td>$${transaction.amount}</td>
    <td>${transaction.category}</td>
    <td>${transaction.date}</td>
  `;

  // Append the new row to the table body
  tableBody.appendChild(newRow);
}

function addtodashboard() {
  const totalTransactions = document.getElementById("total-transactions");
  //const totalAmount = document.getElementById("total-amount");
  //const topCategory = document.getElementById("top-category");
  //const last7Days = document.getElementById("last-7-days");

  // Counts total transactions
   totalTransactions.textContent = transactionArr.length;


    // Calculate total amount 
    //loop to sum up the amounts of all transactions in the transactionArr array.
    let totalAmount = 0;
    for (let i = 0; i < transactionArr.length; i++) {
      totalAmount += transactionArr[i].amount;
    }

    // Show total amount (2 decimal places)
    document.getElementById("total-amount").textContent = totalAmount.toFixed(2);


    //Top Category
    let categoryCount = {};   // Object to store category counts

    // Count how many times each category appears
    for (let i = 0; i < transactionArr.length; i++) {
    // Access the category of the current transaction
    let category = transactionArr[i].category;

    if (categoryCount[category]) {
      categoryCount[category]++;  // If category exists, increase count
    } 
    else {
      categoryCount[category] = 1; // If not, start at 1
    }
  }

  // Find which category has the highest count
  let topCategory = "-";//this will hold the category with the most counts
  let highestCount = 0;//this holds the highest count found so far

  for (let category in categoryCount) {
    if (categoryCount[category] > highestCount) {
      highestCount = categoryCount[category];
      topCategory = category;
    }
  }

  document.getElementById("top-category").textContent = topCategory;


  //Count transactions from the last 7 days
  let today = new Date();// an obj that represents the current date and time.
  let sevenDaysAgo = new Date();// another date obj that will be set to 7 days before today.
  sevenDaysAgo.setDate(today.getDate() - 7);//

  let last7DaysCount = 0;

  for (let i = 0; i < transactionArr.length; i++) {
    let transactionDate = new Date(transactionArr[i].date);

    if (transactionDate >= sevenDaysAgo && transactionDate <= today) {
      last7DaysCount++;
    }
  }

  document.getElementById("last-7-days").textContent = last7DaysCount;
}

