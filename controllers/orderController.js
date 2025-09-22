const { Order, Cart, Product } = require('../models');

const orderController = {
    // Show checkout page with address form
    showCheckout: async (req, res) => {
        try {
            console.log('Order Controller - showCheckout called');
            if (!req.session.user) {
                console.log('No user session, redirecting to login');
                return res.redirect('/auth/log-in');
            }

            const cart = await Cart.findOne({ userId: req.session.user._id }).populate('items.productId');
            
            if (!cart || cart.items.length === 0) {
                return res.redirect('/cart');
            }

            // Calculate totals
            let subtotal = 0;
            cart.items.forEach(item => {
                const price = item.productId.salePrice || item.productId.price;
                subtotal += price * item.quantity;
            });

            const tax = subtotal * 0.13; // 13% tax
            const total = subtotal + tax;

            res.render('checkout', {
                title: 'Checkout',
                layout: 'layouts/main',
                user: req.session.user,
                cart: cart,
                subtotal: subtotal.toFixed(2),
                tax: tax.toFixed(2),
                total: total.toFixed(2)
            });
        } catch (error) {
            console.error('Error in showCheckout:', error);
            res.status(500).render('error', {
                title: 'Error',
                message: 'Error loading checkout page',
                layout: 'layouts/main'
            });
        }
    },

    // Process order placement
    placeOrder: async (req, res) => {
        try {
            if (!req.session.user) {
                return res.redirect('/auth/log-in');
            }

            const { fullName, street, city, state, zipCode, country } = req.body;

            // Validate required fields
            if (!fullName || !street || !city || !state || !zipCode || !country) {
                return res.status(400).json({ 
                    success: false, 
                    message: 'All address fields are required' 
                });
            }

            // Get cart items
            const cart = await Cart.findOne({ userId: req.session.user._id }).populate('items.productId');
            
            if (!cart || cart.items.length === 0) {
                return res.status(400).json({ 
                    success: false, 
                    message: 'Cart is empty' 
                });
            }

            // Prepare order items
            const orderItems = cart.items.map(item => ({
                productId: item.productId._id,
                productTitle: item.productId.title,
                productImage: item.productId.imageUrl,
                quantity: item.quantity,
                price: item.productId.salePrice || item.productId.price
            }));

            // Calculate total
            let orderTotal = 0;
            orderItems.forEach(item => {
                orderTotal += item.price * item.quantity;
            });
            orderTotal += orderTotal * 0.13; // Add tax

            // Create order
            const order = new Order({
                userId: req.session.user._id,
                items: orderItems,
                shippingAddress: {
                    fullName,
                    street,
                    city,
                    state,
                    zipCode,
                    country
                },
                orderTotal: orderTotal
            });

            await order.save();

            // Clear cart after successful order
            await Cart.findOneAndDelete({ userId: req.session.user._id });

            res.json({ 
                success: true, 
                message: 'Your order has been placed successfully!',
                orderId: order._id
            });

        } catch (error) {
            console.error('Error in placeOrder:', error);
            res.status(500).json({ 
                success: false, 
                message: 'Error placing order' 
            });
        }
    },

    // Show order history
    showOrderHistory: async (req, res) => {
        try {
            if (!req.session.user) {
                return res.redirect('/auth/log-in');
            }

            const orders = await Order.find({ userId: req.session.user._id })
                .sort({ orderDate: -1 })
                .populate('items.productId');

            res.render('order-history', {
                title: 'Order History',
                layout: 'layouts/main',
                user: req.session.user,
                orders: orders
            });
        } catch (error) {
            console.error('Error in showOrderHistory:', error);
            res.status(500).render('error', {
                title: 'Error',
                message: 'Error loading order history',
                layout: 'layouts/main'
            });
        }
    },

    // Show order details
    showOrderDetails: async (req, res) => {
        try {
            if (!req.session.user) {
                return res.redirect('/auth/log-in');
            }

            const order = await Order.findById(req.params.id)
                .populate('items.productId');

            if (!order || order.userId.toString() !== req.session.user._id.toString()) {
                return res.status(404).render('error', {
                    title: 'Not Found',
                    message: 'Order not found',
                    layout: 'layouts/main'
                });
            }

            res.render('order-details', {
                title: 'Order Details',
                layout: 'layouts/main',
                user: req.session.user,
                order: order
            });
        } catch (error) {
            console.error('Error in showOrderDetails:', error);
            res.status(500).render('error', {
                title: 'Error',
                message: 'Error loading order details',
                layout: 'layouts/main'
            });
        }
    }
};

module.exports = orderController;
