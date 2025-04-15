const express = require("express");
const router = express.Router();
const inventoryController = require("../controllers/inventoryController");
const { isLoggedIn } = require("../middlewares/authMiddleware");

// List all products
router.get("/list", inventoryController.listProducts);

// Add product routes
router.get("/add", inventoryController.showAddForm);
router.post("/add", inventoryController.addProduct);

// Edit product routes
router.get("/edit/:id", isLoggedIn, inventoryController.showEditForm);
router.post("/edit/:id", isLoggedIn, inventoryController.updateProduct);

// Delete product routes
router.get("/remove/:id", inventoryController.showDeleteForm);
router.post("/remove/:id", inventoryController.deleteProduct);

module.exports = router;