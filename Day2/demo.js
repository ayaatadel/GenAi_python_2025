// Adds two numbers and returns the result.
function addNumbers(a, b) {
  return a + b;
}

// Subtracts the second number from the first and returns the result.
function subtractNumbers(a, b) {
  return a - b;
}

// Multiplies two numbers and returns the result.
function multiplyNumbers(a, b) {
  return a * b;
}

// Divides the first number by the second and returns the result.
// Throws an error if the second number is zero.
function divideNumbers(a, b) {
  if (b === 0) {
    throw new Error("Cannot divide by zero");
  }
  return a / b;
}

module.exports = {
  addNumbers,
  subtractNumbers,
  multiplyNumbers,
  divideNumbers,
};
