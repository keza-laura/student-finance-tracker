const STORAGE = "transactionArr";

// Save transactions to localStorage
export function saveTransactions(transactionArr) {
  const transactionsString = JSON.stringify(transactionArr);
  localStorage.setItem(STORAGE, transactionsString);
}

// Load transactions from localStorage
export function loadTransactions() {
  const savedData = localStorage.getItem(STORAGE);

  if (savedData) {
    return JSON.parse(savedData);
  } else {
    return [];
  }
}


///loadData() - retrieves the stored financial records from localStorage
///saveData(data) - takes an array of financial records and saves it to localStorage 