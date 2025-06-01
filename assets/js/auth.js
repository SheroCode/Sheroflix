/////=========Signup Logic===========////////
const signupForm = document.getElementById("signupForm");
if (signupForm) {
  signupForm.addEventListener("submit", async function (e) {
    e.preventDefault();
    const signupName = document.getElementById("signup-name").value.trim();
    const signupEmail = document.getElementById("signup-email").value.trim();
    const signupPassword = document.getElementById("signup-password").value;
    const messageEl = document.getElementById("signupMessage");
    messageEl.textContent = "";

    if (!signupName || !signupEmail || !signupPassword) {
      messageEl.textContent = "All fields are required.";
      return;
    }
    const emailRegex = /\S+@\S+\.\S+/;
    const passwordRegex = /.{6,}/;
    if (!emailRegex.test(signupEmail)) {
      messageEl.textContent = "Please enter a valid email address.";
      return;
    }
    if (!passwordRegex.test(signupPassword)) {
      messageEl.textContent =
        "Password must be at least 6 characters.";
      return;
    }
    try {
      const res = await fetch(
        `https://shereen-auth-api.glitch.me/users?email=${signupEmail}`
      );
      // console.log(res);
      const existingUser = await res.json();
      // console.log(existingUser);

      if (existingUser.length > 0) {
        messageEl.textContent =
          "This email already exists. Please use another or sign in.";
        return;
      }
    } catch (error) {
      console.error("Signup error:", error);
      messageEl.textContent = "Something went wrong. Please try again.";
    }
    const newUser = {
      name: signupName,
      email: signupEmail,
      password: signupPassword,
    };
    await apiPostUser(newUser);
    messageEl.textContent = "Signup successful! Redirecting...";
    messageEl.classList.add("success");
    signupForm.reset();
    setTimeout(() => {
      window.location.href = "signin.html";
    }, 1500);
  });
  async function apiPostUser(newUser) {
    await fetch("https://shereen-auth-api.glitch.me/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newUser),
    });
  }
}

/////=========Signin Logic===========////////
const signinForm = document.getElementById("signin-form");
if (signinForm) {
  signinForm.addEventListener("submit", async function (e) {
    e.preventDefault();
    const signinEmail = document.getElementById("signin-email").value.trim();
    const signinPassword = document.getElementById("signin-password").value;
    const messageEl = document.getElementById("signinMessage");
    messageEl.textContent = "";
    if (!signinEmail || !signinPassword) {
      messageEl.textContent = "Both fields are required.";
      messageEl.classList.add("error");
      return;
    }
    try {
      const res = await fetch(
        `https://shereen-auth-api.glitch.me/users?email=${signinEmail}`
      );
      const users = await res.json();
      if (users.length === 0) {
        messageEl.textContent = "User not found. Please sign up first.";
        return;
      }
      const user = users[0];
      if (user.password === signinPassword) {
        messageEl.textContent = "Signin successful! Redirecting...";
        messageEl.classList.add("success");
        signinForm.reset();
        localStorage.setItem("currentUser", JSON.stringify(user.email));
        setTimeout(() => {
          window.location.href = "home.html";
        }, 1500);
      } else {
        messageEl.textContent = "Incorrect password.";
        return;
      }
    } catch (error) {
      messageEl.textContent = "Something went wrong. Please try again.";
    }
  });
}
