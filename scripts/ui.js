import { saveTransactions, loadTransactions } from "./storage.js";


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

    const sortFieldSelect = document.getElementById("sort-field");
    const sortDirectionSelect = document.getElementById("sort-direction");
    const applySortBtn = document.getElementById("apply-sort");

    applySortBtn.addEventListener("click", function () {

      const selectedField = sortFieldSelect.value;
      const selectedDirection = sortDirectionSelect.value;

      if (!selectedField) {
        alert("Please select a field to sort by.");
        return;
      }

      currentSort.field = selectedField;
      currentSort.direction = selectedDirection;

      renderApp();
    });

  // Load saved transactions from localStorage when the page loads
    transactionArr = loadTransactions();

    // Update counter to match saved transactions
    counter = transactionArr.length;

    // Add each transaction back into the table
    renderApp();
    

    // Update dashboard with loaded transactions
    addtodashboard();

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

    saveTransactions(transactionArr); // Save to localStorage

    //updates the table with the new transaction 
    renderApp();

    //Update dashboard stats
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



let currentView = "table";



let currentSort = {
  field: null,
  direction: "asc"
};
// This object will keep track of the current sorting state in ascending or descending.



// add to table
function showTable(transactions) {
  const tableBody = document.getElementById("tbody");
  tableBody.innerHTML = ""; // Clear existing table rows

  for (let i = 0; i < transactions.length; i++) {

    const transaction = transactions[i];
    const newRow = document.createElement("tr");
  
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
}


function addtodashboard() {
  const totalTransactions = document.getElementById("total-transactions");

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

function sortData(data) {

  // If no column is selected, return the original data
  if (!currentSort.field) {
    return data;
  }

  // Make a copy of the array (so we don't change the original)
  const sorted = data.slice();

  // Sort the copied array
  sorted.sort(function (a, b) {

    const valueA = a[currentSort.field];
    const valueB = b[currentSort.field];

    // If sorting by amount (numbers)
    if (currentSort.field === "amount") {

      if (currentSort.direction === "asc") {
        return valueA - valueB;
      } else {
        return valueB - valueA;
      }

    }

    // If sorting by date
    if (currentSort.field === "date") {

      const dateA = new Date(valueA);
      const dateB = new Date(valueB);

      if (currentSort.direction === "asc") {
        return dateA - dateB;
      } else {
        return dateB - dateA;
      }

    }

    // Default: compare as text (strings)
    const textA = String(valueA);
    const textB = String(valueB);

    if (currentSort.direction === "asc") {
      return textA.localeCompare(textB);
    } else {
      return textB.localeCompare(textA);
    }

  });

  return sorted;
}

function renderApp() {

  // Step 1: Make a copy of the transactions
  let dataToRender = transactionArr.slice();

  // Step 2: Sort the data
  dataToRender = sortData(dataToRender);

  // Step 3: Check which view we are using
  if (currentView === "table") {
    showTable(dataToRender);
  } else {
    renderCards(dataToRender);
  }
}

function renderCards(data) {
  console.log("Card view not implemented yet");
}


