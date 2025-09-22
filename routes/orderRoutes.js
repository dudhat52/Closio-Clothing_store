const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { isLoggedIn } = require('../middlewares/authMiddleware');

// Debug middleware
router.use((req, res, next) => {
    console.log('Order Route - Path:', req.path, 'Method:', req.method);
    next();
});

// Apply authentication middleware to all order routes
router.use(isLoggedIn);

// Checkout routes
router.get('/checkout', orderController.showCheckout);
router.post('/place', orderController.placeOrder);

// Order history routes
router.get('/history', orderController.showOrderHistory);
router.get('/:id', orderController.showOrderDetails);

module.exports = router;
