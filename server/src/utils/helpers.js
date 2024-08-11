// Function to capitalize words
function capitalizeWords(str) {
  // Check if the string is empty
  if (!str) {
    return null;
  }
  return str.replace(/\b\w/g, (l) => l.toUpperCase());
}

// Function to convert text to lowercase and remove spaces
function lowercaseNoSpace(str) {
  // Check if the string is empty
  if (!str) {
    return null;
  }
  // Remove spaces and convert to lowercase
  return str.replace(/\s+/g, '').toLowerCase();
}

// Function to generate a random passwordwith conditions
function generateRandomPassword() {
  const numbers = '0123456789';
  const symbols = '!@#$%^&*()_+';
  const lowerCaseLetters = 'abcdefghijklmnopqrstuvwxyz';
  const upperCaseLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  const mandatoryCharacters = [
    numbers[Math.floor(Math.random() * numbers.length)],
    symbols[Math.floor(Math.random() * symbols.length)],
    lowerCaseLetters[Math.floor(Math.random() * lowerCaseLetters.length)],
    upperCaseLetters[Math.floor(Math.random() * upperCaseLetters.length)],
  ];

  const allCharacters = numbers + symbols + lowerCaseLetters + upperCaseLetters;
  const additionalLength = 8 - mandatoryCharacters.length;
  for (let i = 0; i < additionalLength; i += 1) {
    mandatoryCharacters.push(
      allCharacters[Math.floor(Math.random() * allCharacters.length)],
    );
  }

  for (let i = mandatoryCharacters.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [mandatoryCharacters[i], mandatoryCharacters[j]] = [
      mandatoryCharacters[j],
      mandatoryCharacters[i],
    ];
  }

  return mandatoryCharacters.join('');
}

module.exports = { capitalizeWords, lowercaseNoSpace, generateRandomPassword };
