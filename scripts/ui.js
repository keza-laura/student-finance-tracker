import { saveTransactions, loadTransactions } from "./storage.js";
import { validateField, patterns} from "./validators.js";
import {searchFilter} from "./search.js"

// Global variables
let transactionArr = loadTransactions() || [];

let currentSort = {
  field: null,
  direction: "asc"
}; // This object will keep track of the current sorting state in ascending or descending.

let editingId = null;

let counter = 0;// This counter will be used to generate IDs for transactions.

let currentView = "table"; // This variable will track whether we are in "table" or "cards" view.



// Wait until the page loads
document.addEventListener("DOMContentLoaded", function () {

  console.log("App is ready");

  const form = document.getElementById("transaction-form");
  const statusMessage = document.getElementById("status-message");
  const statusText = document.getElementById("status-text");
  const tableBody = document.getElementById("tbody"); 

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

  //-----------------------
  //TRANSACTIONS LOGIC
  //-----------------------
  // Load saved transactions from localStorage when the page loads

    // Update counter to match saved transactions
   // Update counter to the highest existing transaction number
    counter = transactionArr.reduce(
    (max, txn) => Math.max(max, parseInt(txn.id.replace("txn_", ""), 10)),
    0
    );
    renderApp();
    // Update dashboard with loaded transactions
    addtodashboard();

    //-----------------------------
    // EDIT & DELETE LOGIC
    //-----------------------------
  // Listen for clicks inside the table body
  // DELETE
    
  tableBody.addEventListener("click", function (event) {

    const clickedElement = event.target;// Get the element that was clicked

    const id = clickedElement.dataset.id;// Get the id stored in the button (data-id)

    if (clickedElement.classList.contains("delete-btn")) {// Check if the clicked element has the class "delete-btn"

      console.log("Deleting transaction with id:", id);

      let updatedTransactions = [];// Create a new array without the deleted transaction

      for (let i = 0; i < transactionArr.length; i++) {

      // If this transaction's id is NOT the one we want to delete
      if (transactionArr[i].id !== id) {
      //keep it in the updated array
      updatedTransactions.push(transactionArr[i]);
    }
  }
      transactionArr = updatedTransactions;// Replace the old array with the new one
}


      saveTransactions(transactionArr);// Save updated list

      renderApp();// Update table

      addtodashboard();// Update dashboard

      // EDIT
    if (clickedElement.classList.contains("edit-btn")) {

      console.log("Editing transaction with id:", id);

      let transaction = null;

      // Loop through transactions to find the matching one
      for (let i = 0; i < transactionArr.length; i++) {

        if (transactionArr[i].id === id) {
          transaction = transactionArr[i];
          break; // stop the loop once found
        }
      }

      // If transaction was found, fill the form
      if (transaction !== null) {

        document.getElementById("description").value = transaction.description;
        document.getElementById("amount").value = transaction.amount;
        document.getElementById("category").value = transaction.category;
        document.getElementById("date").value = transaction.date;

        // Save the id so we know we are editing
        editingId = id;
        
        if (editingId !== null) {   
          for (let i = 0; i < transactionArr.length; i++) {
            if (transactionArr[i].id === editingId) { 
              transactionArr[i].description = description;
              transactionArr[i].amount = parseFloat(amount);
              transactionArr[i].category = category;
              transactionArr[i].date = date;
              transactionArr[i].updatedAt = new Date().toISOString();
              break;
            }
          }
          console.log("Updating transaction with id:", editingId);
          editingId = null;
          console.log("Transaction updated successfully.");
        }
      }
    }

    


  });
  

   // When form is submitted
  form.addEventListener("submit", function (event) {

    event.preventDefault(); // Stop page refresh

    // Get input values
    const description = document.getElementById("description").value.trim();
    const amount = document.getElementById("amount").value.trim();
    const category = document.getElementById("category").value;
    const date = document.getElementById("date").value;

    // Validation
    // Description validation
    if (!validateField("description", description)) {
      showMessage("Description cannot have leading or trailing spaces.", true);
      return;
    }

    // Advanced regex: duplicate word detection
    if (patterns.duplicateWord.test(description)) {
      showMessage("Duplicate word detected in description.", true);
      return;
    }

    // Amount validation
    if (!validateField("amount", amount)) {
      showMessage("Invalid amount format (max 2 decimals).", true);
      return;
    }

    // Category validation
    if (!validateField("category", category)) {
      showMessage("Invalid category format.", true);
      return;
    }

    // Date validation
    if (!validateField("date", date)) {
      showMessage("Invalid date format (YYYY-MM-DD).", true);
      return;
    }

    // UPDATE
    if (editingId !== null) {   
      // Loop through transactions
    for (let i = 0; i < transactionArr.length; i++) {

      // Check if this is the one we are editing
      if (transactionArr[i].id === editingId) { 

        // Update its values
        transactionArr[i].description = description;
        transactionArr[i].amount = parseFloat(amount);
        transactionArr[i].category = category;
        transactionArr[i].date = date;
        transactionArr[i].updatedAt = new Date().toISOString();

          break; // Stop loop once found
      }
    }

      console.log("Updating transaction with id:", editingId);

      // Reset editing mode
      editingId = null;

      console.log("Transaction updated successfully.");
    }
      else {
        // CREATE NEW transaction
        const transaction = {
          id: `txn_${++counter}`,
          description,
          amount: parseFloat(amount),
          category,
          date,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        transactionArr.push(transaction);
        showMessage("Transaction added successfully!");
      
      }

      //common actions
      saveTransactions(transactionArr); // Save to localStorage
      renderApp(); // Update table
      addtodashboard(); // Update dashboard
      form.reset(); // Clear form
  });


  // Monthly cap logic
  const monthlyCapInput = document.getElementById("monthly-cap");
  const saveCapBtn = document.getElementById("save-cap");
  const capMessage = document.getElementById("cap-message");

  // Load saved cap
  const savedCap = localStorage.getItem("monthlyCap");
  if (savedCap) {
    monthlyCapInput.value = savedCap;
  }

  // Save cap
  saveCapBtn.addEventListener("click", function () {
    const capValue = monthlyCapInput.value.trim();

    if (capValue === "" || Number(capValue) < 0) {
      capMessage.textContent = "Please enter a valid monthly limit.";
      capMessage.style.color = "red";
      return;
    }

    localStorage.setItem("monthlyCap", capValue);
    capMessage.textContent = "Monthly limit saved!";
    capMessage.style.color = "green";

    addtodashboard(); // Recalculate dashboard
  });


  const searchInput = document.getElementById("site-search");

  searchInput.addEventListener("input", function () {
    renderApp(); // Re-render the app to apply search filter
  });

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
  });





// add to table
function showTable(transactions) {
  const tableBody = document.getElementById("tbody");
  tableBody.innerHTML = ""; // Clear existing table rows

  for (let i = 0; i < transactions.length; i++) {

    const transaction = transactions[i];
    const newRow = document.createElement("tr");
  
    const searchValue = document.getElementById("site-search").value.trim();
    let highlightRegex = null;

    if (searchValue !== "") {
      try {
        highlightRegex = new RegExp(searchValue, "gi");
      } catch (e) {
        highlightRegex = null;
      }
    }

    function highlight(text) {
      if (!highlightRegex) return text;
      return String(text).replace(highlightRegex, match => `<mark>${match}</mark>`);
    }

    newRow.innerHTML = `
      <td>${highlight(transaction.id)}</td>
      <td>${highlight(transaction.description)}</td>
      <td>$${highlight(transaction.amount)}</td>
      <td>${highlight(transaction.category)}</td>
      <td>${highlight(transaction.date)}</td>
      <td>
        <button class="edit-btn" data-id="${transaction.id}">✏</button>
        <button class="delete-btn" data-id="${transaction.id}">🗑</button>
      </td>
    `;


  // Append the new row to the table body
  tableBody.appendChild(newRow);
    }
}

function renderCards(transactions) {

  // Get the place where we want to show the cards
  const tableBody = document.getElementById("tbody");

  // Clear old content
  tableBody.innerHTML = "";

  // Create a container to hold all cards
  const cardContainer = document.createElement("div");
  cardContainer.className = "card-container";

  // Loop through transactions using a normal for loop
  for (let i = 0; i < transactions.length; i++) {

    const txn = transactions[i];

    // Create a card
    const card = document.createElement("div");
    card.className = "card";

    // Add content to the card
    card.innerHTML =
      "<p><strong>ID:</strong> " + txn.id + "</p>" +
      "<p><strong>Description:</strong> " + txn.description + "</p>" +
      "<p><strong>Amount:</strong> $" + txn.amount + "</p>" +
      "<p><strong>Category:</strong> " + txn.category + "</p>" +
      "<p><strong>Date:</strong> " + txn.date + "</p>";

    // Add the card to the container
    cardContainer.appendChild(card);
  }

  // Add the container to the page
  tableBody.appendChild(cardContainer);
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


  // ===== Monthly Cap Logic =====
const capMessage = document.getElementById("cap-message");
const savedCapValue = localStorage.getItem("monthlyCap");

if (savedCapValue) {

  const todayDate = new Date();
  const currentMonth = todayDate.getMonth();
  const currentYear = todayDate.getFullYear();

  let monthlyTotal = 0;

  for (let i = 0; i < transactionArr.length; i++) {
    const txnDate = new Date(transactionArr[i].date);

    if (
      txnDate.getMonth() === currentMonth &&
      txnDate.getFullYear() === currentYear
    ) {
      monthlyTotal += transactionArr[i].amount;
    }
  }

  const capNumber = parseFloat(savedCapValue);
  const remaining = capNumber - monthlyTotal;

  if (remaining >= 0) {
    capMessage.textContent =
      "Remaining this month: $" + remaining.toFixed(2);
    capMessage.style.color = "green";
  } else {
    capMessage.textContent =
      "Monthly limit exceeded by $" + Math.abs(remaining).toFixed(2);
    capMessage.style.color = "red";
  }
}
}

  

function renderApp() {

  // Make a copy of the transactions
  let dataToRender = sortedTransactions();

  //Apply regex filtering from search.js
  const searchInput = document.getElementById("site-search");
  dataToRender = searchFilter(dataToRender, searchInput.value.trim());

  
  // Check which view we are using
  if (currentView === "table") {
    showTable(dataToRender);
  } 
  else {
    renderCards(dataToRender);
  }
}

function sortedTransactions() {


 // If no column is selected, return the original data
  if (!currentSort.field) {
    return transactionArr;
  }

  // Make a copy of the array (so we don't change the original)
  const sorted = transactionArr.slice();

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


// DOM, reendering, event listeners, and UI logic
//AI usage
//Prompt: “Help me clean and structure what I wrote keeping my comments.”
//Decided not to add state.js was too complex for me to understand and implement in ui.js