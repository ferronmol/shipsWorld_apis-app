const form = document.getElementById("login-form");
const username = document.getElementById("username");
const password = document.getElementById("password");

//Events
//Event when form is submit

form.addEventListener("submit", (event) => {
  event.preventDefault();
  if (username.value != "" && password.value != "") {
    let user = {
      name: username.value,
    };
    localStorage.setItem("username", JSON.stringify(user));
  }
  location.href = "../pages/wow.html";
});
