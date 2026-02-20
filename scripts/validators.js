// All regex patterns stored in one place
export const patterns = {
  
  description: /^\S(?:.*\S)?$/,// No leading or trailing spaces

  amount: /^(0|[1-9]\d*)(\.\d{1,2})?$/,// Whole number or decimal (max 2 decimal places)

  date: /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/,// Strict YYYY-MM-DD format

  category: /^[A-Za-z]+(?:[ -][A-Za-z]+)*$/,// Letters, spaces or hyphens only

  duplicateWord: /\b(\w+)\s+\1\b/i//Detects duplicate words
};

// Function to test a value against a pattern
export function validateField(fieldName, value) {
  const pattern = patterns[fieldName];

  if (!pattern) {
    return true; // If no pattern found, consider valid
  }

  return pattern.test(value);
}



/*Contains regex patterns
Tests if input is correct
Returns true or false*/