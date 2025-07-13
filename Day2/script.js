// Handle Login Form
const loginForm = document.querySelector("form:not(#register-form)");
if (loginForm) {
  loginForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const username = loginForm.querySelector('input[type="text"]').value;
    const password = loginForm.querySelector('input[type="password"]').value;
    if (username === "admin" && password === "admin123") {
      alert("Login successful!");
      // Redirect or further logic can go here
    } else {
      alert("Invalid username or password.");
    }
  });
}

// Handle Register Form
const registerForm = document.getElementById("register-form");
if (registerForm) {
  registerForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const username = registerForm.querySelector('input[name="username"]').value;
    const email = registerForm.querySelector('input[name="email"]').value;
    const password = registerForm.querySelector('input[name="password"]').value;
    const confirmPassword = registerForm.querySelector(
      'input[name="confirm_password"]'
    ).value;

    if (!username || !email || !password || !confirmPassword) {
      alert("Please fill in all fields.");
      return;
    }
    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }
    alert("Registration successful!");
    // Further registration logic can go here
  });
}
