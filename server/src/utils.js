// Function to capitalize words
function capitalizeWords(str) {
  return str.replace(/\b\w/g, (l) => l.toUpperCase());
}

// Function to convert text to lowercase and remove spaces
function lowercaseNoSpace(str) {
  return str.replace(/\s+/g, '').toLowerCase();
}

module.exports = { capitalizeWords, lowercaseNoSpace };
