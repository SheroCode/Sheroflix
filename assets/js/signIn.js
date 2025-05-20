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
