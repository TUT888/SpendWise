// const EXPENSE_URL = `${EXPENSE_SERVICE_URL}/api/expense`;

// console.log("EXPENSE_URL: ", EXPENSE_URL)

// Trigger openning expense modal
$(document).on('click', '.add-expense-btn', function () {
  $("#expense_form_title").html("Add new expense");
  $("#expense_form").data("expense-id", "");
  $("#add_expense_btn").show();
  $("#edit_expense_btn").hide();
})

$(document).on('click', '.edit-expense-btn', function () {
  var expense_id = $(this).data("expense-id");
  $("#expense_form_title").html("Edit your expense");
  $("#expense_form").data("expense-id", expense_id);
  $("#edit_expense_btn").show();
  $("#add_expense_btn").hide();

  let table_row = $(this).parent().parent();
  
  let input_date = table_row.find(".expense-date-col").html();
  let input_category_name = table_row.find(".expense-category-col").html();
  let input_description = table_row.find(".expense-description-col").html();
  let input_amount = table_row.find(".expense-amount-col").html();

  $("#input_category").val(input_category_name);
  $("#input_description").val(input_description);
  $("#input_amount").val(input_amount);
})

// Delete expense
$(document).on('click', '.delete-expense-btn', function () {
  event.preventDefault();
  console.log("Clicked");
  
  let expense_id = $(this).data("expense-id");
  
  let formData = {
    expense_id: expense_id
  }

  $.ajax({
    url: "/expense",
    type: "DELETE",
    contentType: 'application/json',
    data: JSON.stringify(formData),
    xhrFields: {
      withCredentials: true
    },
    success: (result) => {
      console.log("Delete expense successfully");
      let wrappedNode = $(this).parent().parent();
      wrappedNode.remove();
      console.log(wrappedNode.children());
    },
    error: function (result) {
      console.log("Delete expense failed");
    }
  })
  
})

// Add new expense
$(document).on("click", "#add_expense_btn", () => {
  event.preventDefault();
  
  let user_email = $("#user_email").html();
  let input_amount = $("#input_amount").val();
  let input_description = $("#input_description").val();
  let input_category_name = $("#input_category").val();

  let formData = {
    user_email: user_email,
    amount: input_amount,
    description: input_description,
    category_name: input_category_name
  }
  
  $.ajax({
    url: "/expense",
    type: "POST",
    contentType: 'application/json',
    data: JSON.stringify(formData),
    xhrFields: {
      withCredentials: true
    },
    success: (result) => {
      console.log("SUCCESS")
      console.log(result);
      window.location.href = '/expense';
    },
    error: function (result) {
      console.log("ERROR")
      console.log(result.responseJSON);
    }
  })
})

$(document).on("click", "#edit_expense_btn", () => {
  event.preventDefault();
  
  let expense_id = $("#expense_form").data("expense-id");
  let input_amount = $("#input_amount").val();
  let input_description = $("#input_description").val();
  let input_category_name = $("#input_category").val();

  let formData = {
    expense_id: expense_id,
    amount: input_amount,
    description: input_description,
    category_name: input_category_name
  }
  
  $.ajax({
    url: "/expense",
    type: "PUT",
    contentType: 'application/json',
    data: JSON.stringify(formData),
    xhrFields: {
      withCredentials: true
    },
    success: (result) => {
      console.log("SUCCESS")
      console.log(result);
      window.location.href = '/expense';
    },
    error: function (result) {
      console.log("ERROR")
      console.log(result.responseJSON);
    }
  })
})