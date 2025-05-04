const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const isAuthenticated = require('../middlewares/authentication')

router.get('/', isAuthenticated, categoryController.getAllCategory);
router.post('/', isAuthenticated, categoryController.addCategory);
router.put('/', isAuthenticated, categoryController.updateCategory);
router.delete('/', isAuthenticated, categoryController.deleteCategory);

module.exports = router;