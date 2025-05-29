const express = require("express");
const router = express.Router();
const inventoryController = require("../controllers/inventoryController");
const { isLoggedIn, isClerk } = require("../middlewares/authMiddleware");

// Apply isClerk middleware to all inventory routes
router.use(isClerk);

// List all products
router.get("/list", inventoryController.listProducts);

// Add product routes
router.get("/add", inventoryController.showAddForm);
router.post("/add", inventoryController.addProduct);

// Edit product routes
router.get("/edit/:id", inventoryController.showEditForm);
router.post("/edit/:id", inventoryController.updateProduct);

// Delete product routes
router.get("/remove/:id", inventoryController.showDeleteForm);
router.post("/remove/:id", inventoryController.deleteProduct);

module.exports = router;