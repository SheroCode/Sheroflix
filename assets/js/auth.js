


const signinForm = document.getElementById("signin-form");
if (signinForm) {
  signinForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const signinEmail = document.getElementById("signin-email").value.trim();
    const signinPassword = document.getElementById("signin-password").value;
    const messageEl = document.getElementById("signinMessage");

    messageEl.textContent = "";
    messageEl.classList.remove("success");
    if (!signinEmail || !signinPassword) {
      messageEl.textContent = "Both email and password are required.";
      return;
    }

    const users = JSON.parse(localStorage.getItem("users"));
    if (users) {
      const existingUser = users.find(
        (user) => user.email === signinEmail && user.password === signinPassword
      );
      if (existingUser) {
        localStorage.setItem("currentUser", JSON.stringify(existingUser));
        messageEl.textContent = " Sign in successful! Redirecting...";
        messageEl.classList.add("success");
        setTimeout(() => {
          window.location.href = "home.html";
        }, 1500);
      } else {
        messageEl.textContent = "Invalid email or password.";
      }
    }
  });
}
const signupForm = document.getElementById("signupForm");
if (signupForm) {
  signupForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const signupName = document.getElementById("signup-name").value.trim();
    const signupEmail = document.getElementById("signup-email").value.trim();
    const signupPassword = document.getElementById("signup-password").value;
    const messageEl = document.getElementById("signupMessage");

    messageEl.textContent = "";
    messageEl.classList.remove("success");

    if (!signupName || !signupEmail || !signupPassword) {
      messageEl.textContent = "All fields are required.";
      return;
    }
    // Get existing users from localStorage or initialize empty array
    let users = JSON.parse(localStorage.getItem("users")) || [];

    // Check if email already exists
    const userExists = users.some((user) => user.email === signupEmail); //true or false
    if (userExists) {
      messageEl.textContent = "User already exists. Please sign in.";
      return;
    }

    const newUser = {
      name: signupName,
      email: signupEmail,
      password: signupPassword,
    };

    users.push(newUser);

    // Save updated users array to localStorage
    localStorage.setItem("users", JSON.stringify(users));
    messageEl.textContent = "Signup successful! Redirecting...";
    messageEl.classList.add("success");
    setTimeout(() => {
      window.location.href = "signin.html";
    }, 1500);
  });
}
