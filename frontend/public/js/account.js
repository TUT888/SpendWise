const REGISTER_API_URL = `${ACCOUNT_SERVICE_URL}/api/account/register`;
const LOGIN_API_URL = `${ACCOUNT_SERVICE_URL}/api/account/login`;
const LOGOUT_API_URL = `${ACCOUNT_SERVICE_URL}/api/account/logout`;

console.log("REGISTER_API_URL: ", REGISTER_API_URL)
console.log("LOGIN_API_URL: ", LOGIN_API_URL)
console.log("LOGOUT_API_URL: ", LOGOUT_API_URL)
$("#logout_button").click(function () {
  console.log("Click");
  $.ajax({
    url: LOGOUT_API_URL,
    type: "POST",
    xhrFields: {
      withCredentials: true // crucial: sends cookies
    },
    success: (result) => {
      console.log("Logged out successfully");
      window.location.href = '/';
    },
    error: function (result) {
      console.log("Logged out failed");
    }
  })
})

$(document).on("click", "#login_btn", () => {
  event.preventDefault();
  console.log("Clicked");

  let input_email = $("#input_email").val();
  let input_password = $("#input_password").val();

  let formData = {
    email: input_email,
    password: input_password
  }

  console.log(formData);

  $.ajax({
    url: LOGIN_API_URL,
    type: "POST",
    contentType: 'application/json',
    data: JSON.stringify(formData),
    xhrFields: {
      withCredentials: true // crucial: sends cookies
    },
    success: (result) => {
      console.log("SUCCESS")
      console.log(result);
      window.location.href = '/';
    },
    error: function (result) {
      console.log("ERROR")
      console.log(result.responseJSON);
    }
  })
})

$(document).on("click", "#register_btn", () => {
  event.preventDefault();
  console.log("Clicked");

  let input_name = $("#input_name").val();
  let input_email = $("#input_email").val();
  let input_password = $("#input_password").val();

  let formData = {
    name: input_name,
    email: input_email,
    password: input_password
  }

  console.log(formData);

  $.ajax({
    url: REGISTER_API_URL,
    type: "POST",
    contentType: 'application/json',
    data: JSON.stringify(formData),
    xhrFields: {
      withCredentials: true // crucial: sends cookies
    },
    success: (result) => {
      console.log("SUCCESS")
      console.log(result);
      window.location.href = '/login';
    },
    error: function (result) {
      console.log("ERROR")
      console.log(result.responseJSON);
    }
  })
})