const Expense = require("../models/expense");
const User = require("../models/user");

const getAllExpense = async (req, res) => {
  try {
    // Get data
    const { user_email } = req.query;
    if (!user_email) {
      return res.status(400).json({
        success: false,
        message: "Provided information is invalid",
      });
    }
    
    // Validate
    const user = await User.findOne({ email: user_email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found"
      })
    }

    // Find
    var allExpense = await Expense.find({ user_id: user._id })
    if (allExpense.length === 0) {
      return res.status(200).json({
        success: true,
        message: "There are not any registered expense",
        expense: allExpense
      });
    }
    
    return res.status(200).json({
      success: true,
      message: "Get all expenses successful!",
      expense: allExpense
    });
  } catch (err) {
    console.error("Failed with Internal Server Error:", err);
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
      return res.status(400).json({
        success: false,
        message: "Provided information is invalid",
      });
    }
    
    // Validate
    const user = await User.findOne({ email: user_email });
    if (!user) {
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

    return res.status(200).json({
      success: true,
      message: "Add expense successful!",
    });
  } catch (err) {
    console.error("Failed with Internal Server Error:", err);
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
      return res.status(400).json({
        success: false,
        message: "Provided information is invalid",
      });
    }
    
    // Validate
    const expense = await Expense.findOne({ _id: expense_id });
    if (!expense) {
      return res.status(400).json({
        success: false,
        message: "Expense not found"
      })
    }

    // Delete
    const result = await Expense.deleteOne({ _id: expense_id });

    return res.status(200).json({
      success: true,
      message: "Delete expense successful!",
    });
  } catch (err) {
    console.error("Failed with Internal Server Error:", err);
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
      return res.status(400).json({
        success: false,
        message: "Provided information is invalid",
      });
    }
    
    // Validate
    const expense = await Expense.findOne({ _id: expense_id });
    if (!expense) {
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

    return res.status(200).json({
      success: true,
      message: "Update expense successful!",
    });
  } catch (err) {
    console.error("Failed with Internal Server Error:", err);
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
