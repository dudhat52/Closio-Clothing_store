const express = require('express');
const router = express.Router();
const { Cart, Product, User } = require('../models');
const nodemailer = require('nodemailer');

router.use((req, res, next) => {
    console.log('Cart Route - Session User:', req.session.user);
    next();
});

const isCustomer = (req, res, next) => {
    if (!req.session.user || req.session.user.role !== 'customer') {
        return res.redirect('/auth/log-in');
    }
    next();
};

router.post('/add', async (req, res) => {
    try {
        // Check if user is logged in
        if (!req.session.user || !req.session.user._id) {
            console.log('User not logged in');
            return res.redirect('/auth/log-in');
        }

        const { productId } = req.body;
        console.log('Adding product to cart:', { productId, userId: req.session.user._id });

        // Validate productId
        if (!productId) {
            console.error('No productId provided');
            return res.status(400).send('Product ID is required');
        }

        // Verify user exists
        const user = await User.findById(req.session.user._id);
        if (!user) {
            console.error('User not found:', req.session.user._id);
            return res.redirect('/auth/log-in');
        }

        // Verify product exists
        const product = await Product.findById(productId);
        if (!product) {
            console.error('Product not found:', productId);
            return res.status(404).send('Product not found');
        }

        // Find or create cart
        let cart = await Cart.findOne({ userId: req.session.user._id });
        if (!cart) {
            cart = new Cart({
                userId: req.session.user._id,
                items: []
            });
            console.log('Created new cart for user:', req.session.user._id);
        }

        // Check if product already in cart
        const existingItemIndex = cart.items.findIndex(
            item => item.productId.toString() === productId
        );

        if (existingItemIndex > -1) {
            // Update existing item
            cart.items[existingItemIndex].quantity += 1;
            console.log('Updated quantity for existing item');
        } else {
            // Add new item
            cart.items.push({
                productId: productId,
                quantity: 1
            });
            console.log('Added new item to cart');
        }

        // Save cart
        await cart.save();
        console.log('Cart saved successfully:', cart);

        res.redirect('/cart');
    } catch (error) {
        console.error('Error adding to cart:', error);
        res.status(500).send('Error adding item to cart: ' + error.message);
    }
});

// View cart
router.get('/', async (req, res) => {
    try {
        // Check if user is logged in
        if (!req.session.user || !req.session.user._id) {
            console.log('User not logged in');
            return res.redirect('/auth/log-in');
        }

        console.log('Fetching cart for user:', req.session.user._id);

        // Find cart and populate product details
        const cart = await Cart.findOne({ userId: req.session.user._id })
            .populate({
                path: 'items.productId',
                model: 'Product',
                select: 'title price salePrice imageUrl'
            });

        console.log('Found cart:', JSON.stringify(cart, null, 2));

        if (!cart || !cart.items || cart.items.length === 0) {
            console.log('No items in cart');
            return res.render('cart', {
                title: 'Shopping Cart',
                cart: {
                    items: [],
                    subtotal: 0,
                    tax: 0,
                    total: 0
                },
                success: req.query.order === 'success',
                layout: 'layouts/main'
            });
        }

        // Calculate totals
        let subtotal = 0;
        const validItems = cart.items.filter(item => item.productId != null);
        
        validItems.forEach(item => {
            const price = item.productId.salePrice || item.productId.price;
            subtotal += price * item.quantity;
        });

        const tax = subtotal * 0.13; // 13% tax rate
        const total = subtotal + tax;

        console.log('Cart details:', {
            itemCount: validItems.length,
            items: validItems.map(item => ({
                title: item.productId.title,
                price: item.productId.price,
                quantity: item.quantity
            })),
            subtotal,
            tax,
            total
        });

        // Create cart object with all necessary data
        const cartData = {
            items: validItems,
            subtotal: subtotal,
            tax: tax,
            total: total
        };

        res.render('cart', {
            title: 'Shopping Cart',
            cart: cartData,
            success: req.query.order === 'success',
            layout: 'layouts/main'
        });
    } catch (error) {
        console.error('Error viewing cart:', error);
        res.status(500).send('Error viewing cart: ' + error.message);
    }
});

// Update cart item quantity
router.post('/update', async (req, res) => {
    try {
        if (!req.session.user || !req.session.user._id) {
            console.log('User not logged in');
            return res.redirect('/auth/log-in');
        }

        const { productId, action } = req.body;
        console.log('Updating cart:', { productId, action, userId: req.session.user._id });

        const cart = await Cart.findOne({ userId: req.session.user._id });
        if (!cart) {
            console.error('Cart not found for user:', req.session.user._id);
            return res.status(404).send('Cart not found');
        }

        const item = cart.items.find(item => item.productId.toString() === productId);
        if (!item) {
            console.error('Item not found in cart');
            return res.redirect('/cart');
        }

        // Update quantity based on action
        if (action === 'increase') {
            item.quantity += 1;
        } else if (action === 'decrease') {
            item.quantity = Math.max(0, item.quantity - 1);
            if (item.quantity === 0) {
                // Remove item if quantity becomes 0
                cart.items = cart.items.filter(i => i.productId.toString() !== productId);
            }
        }

        await cart.save();
        console.log('Cart updated successfully');
        res.redirect('/cart');
    } catch (error) {
        console.error('Error updating cart:', error);
        res.status(500).send('Error updating cart: ' + error.message);
    }
});

// Place order
router.post('/checkout', async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.session.user._id });
        if (!cart) {
            return res.status(404).send('Cart not found');
        }

        // Process the order here
        // ... order processing logic ...

        // Clear the cart after successful order
        cart.items = [];
        await cart.save();

        // Redirect to cart without success message
        res.redirect('/cart');
    } catch (error) {
        console.error('Error during checkout:', error);
        res.status(500).send('Error processing checkout');
    }
});

// Remove item from cart
router.post('/remove', async (req, res) => {
    try {
        if (!req.session.user || !req.session.user._id) {
            console.log('User not logged in');
            return res.redirect('/auth/log-in');
        }

        const { productId } = req.body;
        console.log('Removing product from cart:', { productId, userId: req.session.user._id });

        const cart = await Cart.findOne({ userId: req.session.user._id });
        if (!cart) {
            console.error('Cart not found for user:', req.session.user._id);
            return res.status(404).send('Cart not found');
        }

        // Remove the item from the cart
        cart.items = cart.items.filter(item => item.productId.toString() !== productId);

        await cart.save();
        console.log('Item removed from cart successfully');
        res.redirect('/cart');
    } catch (error) {
        console.error('Error removing item from cart:', error);
        res.status(500).send('Error removing item from cart: ' + error.message);
    }
});

module.exports = router; 