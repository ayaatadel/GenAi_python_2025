const {
  addNumbers,
  subtractNumbers,
  multiplyNumbers,
  divideNumbers,
} = require("./demo");

describe("addNumbers", () => {
  test("adds 2 + 3 to equal 5", () => {
    expect(addNumbers(2, 3)).toBe(5);
  });
});

describe("subtractNumbers", () => {
  test("subtracts 5 - 2 to equal 3", () => {
    expect(subtractNumbers(5, 2)).toBe(3);
  });
});

describe("multiplyNumbers", () => {
  test("multiplies 4 * 3 to equal 12", () => {
    expect(multiplyNumbers(4, 3)).toBe(12);
  });
});

describe("divideNumbers", () => {
  test("divides 10 / 2 to equal 5", () => {
    expect(divideNumbers(10, 2)).toBe(5);
  });

  test("throws error when dividing by zero", () => {
    expect(() => divideNumbers(5, 0)).toThrow("Cannot divide by zero");
  });
});
