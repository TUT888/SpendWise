const Expense = require("../models/expense");
const User = require("../models/user");
const { logError, logInfo } = require("../logger")

const getAllExpense = async (req, res) => {
  try {
    // Get data
    const { user_email } = req.query;
    if (!user_email) {
      logError(req.method, req.url, "get expense failed, provided information is invalid");
      return res.status(400).json({
        success: false,
        message: "Provided information is invalid",
      });
    }
    
    // Validate
    const user = await User.findOne({ email: user_email });
    if (!user) {
      logError(req.method, req.url, "get expense failed, user not found");
      return res.status(400).json({
        success: false,
        message: "User not found"
      })
    }

    // Find
    var allExpense = await Expense.find({ user_id: user._id })
    if (allExpense.length === 0) {
      logInfo(req.method, req.url, `get expense successful for ${user_email}, there isn't any registered expense`);
      return res.status(200).json({
        success: true,
        message: "There isn't any registered expense",
        expense: allExpense
      });
    }
    
    logInfo(req.method, req.url, `get expense successful for ${user_email}`);
    return res.status(200).json({
      success: true,
      message: "Get all expenses successful!",
      expense: allExpense
    });
  } catch (err) {
    logError(req.method, req.url, `get expense failed with Internal Server Error: ${err}`);
    // console.error("Failed with Internal Server Error:", err);
    return res.status(500).json({ 
      success: false, 
      message: "Internal Server Error" 
    });
  }
};

const addExpense = async (req, res) => {
  try {
    // Get data
    const { user_email, amount, description, category_name } = req.body;
    if (!user_email || !amount || !description || !category_name) {
      logError(req.method, req.url, "add expense failed, provided information is invalid");
      return res.status(400).json({
        success: false,
        message: "Provided information is invalid",
      });
    }
    
    // Validate
    const user = await User.findOne({ email: user_email });
    if (!user) {
      logError(req.method, req.url, "add expense failed, user not found");
      return res.status(400).json({
        success: false,
        message: "User not found"
      })
    }
    
    // Insert
    const newExpense = await Expense.insertOne({
      user_id: user._id,
      amount: amount,
      description: description,
      category_name: category_name
    })

    logInfo(req.method, req.url, `add expense successful for ${user_email}`);
    return res.status(200).json({
      success: true,
      message: "Add expense successful!",
    });
  } catch (err) {
    // console.error("Failed with Internal Server Error:", err);
    logError(req.method, req.url, `add expense failed with Internal Server Error: ${err}`);
    return res.status(500).json({ 
      success: false, 
      message: "Internal Server Error" 
    });
  }
};

const deleteExpense = async (req, res) => {
  try {
    // Get data
    const { expense_id } = req.body;
    if (!expense_id) {
      logError(req.method, req.url, "delete expense failed, provided information is invalid");
      return res.status(400).json({
        success: false,
        message: "Provided information is invalid",
      });
    }
    
    // Validate
    const expense = await Expense.findOne({ _id: expense_id });
    if (!expense) {
      logError(req.method, req.url, "delete expense failed, expense not found");
      return res.status(400).json({
        success: false,
        message: "Expense not found"
      })
    }

    // Delete
    const result = await Expense.deleteOne({ _id: expense_id });
    
    logInfo(req.method, req.url, `delete expense ${expense_id} successful`);
    return res.status(200).json({
      success: true,
      message: "Delete expense successful!",
    });
  } catch (err) {
    // console.error("Failed with Internal Server Error:", err);
    logError(req.method, req.url, `delete expense failed with Internal Server Error: ${err}`);
    return res.status(500).json({ 
      success: false, 
      message: "Internal Server Error" 
    });
  }
};

const updateExpense = async (req, res) => {
  try {
    // Get data
    var { expense_id, amount, description, category_name } = req.body;
    if (!expense_id || !amount || !description || !category_name) {
      logError(req.method, req.url, "update expense failed, provided information is invalid");
      return res.status(400).json({
        success: false,
        message: "Provided information is invalid",
      });
    }
    
    // Validate
    const expense = await Expense.findOne({ _id: expense_id });
    if (!expense) {
      logError(req.method, req.url, "update expense failed, expense not found");
      return res.status(400).json({
        success: false,
        message: "Expense not found"
      })
    }

    // Update
    const result = await Expense.updateOne({ _id: expense_id },
      {
        amount: amount,
        description: description,
        category_name: category_name
      }
    );
    
    logInfo(req.method, req.url, `update expense ${expense_id} successful`);
    return res.status(200).json({
      success: true,
      message: "Update expense successful!",
    });
  } catch (err) {
    // console.error("Failed with Internal Server Error:", err);
    logError(req.method, req.url, `update expense failed with Internal Server Error: ${err}`);
    return res.status(500).json({ 
      success: false, 
      message: "Internal Server Error" 
    });
  }
};

module.exports = {
  getAllExpense,
  addExpense,
  deleteExpense,
  updateExpense
};
