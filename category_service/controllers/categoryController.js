const Category = require("../models/category");
const User = require("../models/user");

const getAllCategory = async (req, res) => {
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

    // Insert
    const allCategory = await Category.find({ user_id: user._id })
    if (allCategory.length === 0) {
      return res.status(200).json({
        success: true,
        message: "There are not any registered category",
        category: allCategory
      });
    }

    return res.status(200).json({
      success: true,
      message: "Get all categorys successful!",
      category: allCategory
    });
  } catch (err) {
    console.error("Failed with Internal Server Error:", err);
    return res.status(500).json({ 
      success: false, 
      message: "Internal Server Error" 
    });
  }
};

const addCategory = async (req, res) => {
  try {
    // Get data
    const { user_email, category_name, category_description } = req.body;
    if (!user_email || !category_name || !category_description) {
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
    const newCategory = await Category.insertOne({
      user_id: user._id,
      name: category_name,
      description: category_description
    })

    return res.status(200).json({
      success: true,
      message: "Add category successful!",
    });
  } catch (err) {
    console.error("Failed with Internal Server Error:", err);
    return res.status(500).json({ 
      success: false, 
      message: "Internal Server Error" 
    });
  }
};

const deleteCategory = async (req, res) => {
  try {
    // Get data
    const { category_id } = req.body;
    if (!category_id) {
      return res.status(400).json({
        success: false,
        message: "Provided information is invalid",
      });
    }
    
    // Validate
    const category = await Category.findOne({ _id: category_id });
    if (!category) {
      return res.status(400).json({
        success: false,
        message: "Category not found"
      })
    }

    // Insert
    const result = await Category.deleteOne({ _id: category_id });

    return res.status(200).json({
      success: true,
      message: "Delete category successful!",
    });
  } catch (err) {
    console.error("Failed with Internal Server Error:", err);
    return res.status(500).json({ 
      success: false, 
      message: "Internal Server Error" 
    });
  }
};

const updateCategory = async (req, res) => {
  try {
    // Get data
    const { category_id, category_name, category_description } = req.body;
    if (!category_id || !category_name || !category_description) {
      return res.status(400).json({
        success: false,
        message: "Provided information is invalid",
      });
    }
    
    // Validate
    const category = await Category.findOne({ _id: category_id });
    if (!category) {
      return res.status(400).json({
        success: false,
        message: "Category not found"
      })
    }

    // Insert
    const result = await Category.updateOne({ _id: category_id },
      {
        name: category_name,
        description: category_description
      }
    );

    return res.status(200).json({
      success: true,
      message: "Update category successful!",
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
  getAllCategory,
  addCategory,
  deleteCategory,
  updateCategory
};
