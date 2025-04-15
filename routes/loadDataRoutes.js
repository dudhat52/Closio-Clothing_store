const express = require("express");
const router = express.Router();
const loadDataController = require("../controllers/loadDataController");

// Load data route
router.get("/products", loadDataController.loadProducts);

module.exports = router; 