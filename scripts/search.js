// Apply search filter if search input exists
export function searchFilter(data, searchValue) {
  // If searchValue is empty, return the original array
  if (!searchValue) return data;

  try {
    // Create a case-insensitive regex from the searchValue
    const searchRegex = new RegExp(searchValue, "i");

    // Filter transactions that match the searchValue
    return data.filter(txn => 
      searchRegex.test(txn.description) || 
      searchRegex.test(txn.category) || 
      searchRegex.test(txn.amount.toString()) || 
      searchRegex.test(txn.date)
    );

  } catch (error) {
    // If regex fails (invalid input), log error and return original data
    console.error("Error during search:", error);
    return data;
  }
}
