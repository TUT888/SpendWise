$("#logout_button").click(function () {
  console.log("Click");
  $.ajax({
    url: "/logout",
    type: "POST",
    xhrFields: {
      withCredentials: true
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
    url: "/login",
    type: "POST",
    contentType: 'application/json',
    data: JSON.stringify(formData),
    xhrFields: {
      withCredentials: true
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
    url: "/register",
    type: "POST",
    contentType: 'application/json',
    data: JSON.stringify(formData),
    xhrFields: {
      withCredentials: true
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