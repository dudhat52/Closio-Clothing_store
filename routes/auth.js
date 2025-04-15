const express = require("express");
const { User, Cart } = require("../models");
const bcrypt = require("bcryptjs");
const formValidator = require("../utils/validation");
const mailer = require("../utils/mailer");
const router = express.Router();

// Debug middleware
router.use((req, res, next) => {
    console.log('Auth Route - Current Session:', req.session);
    next();
});

// Login page
router.get("/log-in", (req, res) => {
    res.render("log-in", {
        title: "Log In",
        layout: "layouts/main"
    });
});

// Process login
router.post("/log-in", async (req, res) => {
    try {
        console.log('Login attempt:', req.body.email);
        const { email, password } = req.body;

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            console.log('User not found:', email);
            return res.render("log-in", {
                title: "Log In",
                error: "Invalid email or password",
                layout: "layouts/main"
            });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log('Invalid password for user:', email);
            return res.render("log-in", {
                title: "Log In",
                error: "Invalid email or password",
                layout: "layouts/main"
            });
        }

        // Set session
        req.session.user = {
            _id: user._id.toString(), // Ensure ID is a string
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role
        };

        console.log('User logged in successfully:', {
            userId: user._id,
            email: user.email,
            role: user.role
        });

        // Save session explicitly
        req.session.save((err) => {
            if (err) {
                console.error('Session save error:', err);
                return res.status(500).send('Error saving session');
            }
            // Redirect all users to inventory list page
            res.redirect("/inventory/list");
        });
    } catch (error) {
        console.error("Login error:", error);
        res.render("log-in", {
            title: "Log In",
            error: "An error occurred during login",
            layout: "layouts/main"
        });
    }
});

// Register route
router.post("/register", async (req, res) => {
    const { firstName, lastName, email, password, role } = req.body;

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        
        if (existingUser) {
            return res.status(400).render("sign-up", {
                title: "Sign Up",
                errors: [{ msg: "User already exists with this email" }],
                formData: { firstName, lastName, email },
                layout: "layouts/main"
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const user = new User({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            role: role || 'customer'
        });

        await user.save();

        // Set user session after successful registration
        req.session.user = {
            _id: user._id.toString(), // Ensure ID is a string
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role
        };

        // Save session explicitly
        req.session.save((err) => {
            if (err) {
                console.error('Session save error:', err);
                return res.status(500).send('Error saving session');
            }
            res.redirect("/inventory/list");
        });

    } catch (error) {
        console.error("Registration error:", error);
        res.status(400).render("sign-up", {
            title: "Sign Up",
            errors: [{ msg: "An error occurred during registration. Please try again." }],
            formData: { firstName, lastName, email },
            layout: "layouts/main"
        });
    }
});

// Logout route
router.get("/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Logout error:', err);
            return res.status(500).send('Error during logout');
        }
        res.redirect("/log-in");
    });
});

// Welcome Page
router.get("/welcome", (req, res) => {
  res.render("welcome", { title: "Welcome!" });
});

router.get("/cart", (req, res) => {
    if (!req.session.user) {
        return res.redirect("/log-in");
    }
    res.render("cart", { 
        title: "Shopping Cart",
        items: [],  // Empty array here!
        subtotal: 0,
        tax: 0,
        total: 0,
        layout: "layouts/main",
        req: req
    });
});

module.exports = router;
