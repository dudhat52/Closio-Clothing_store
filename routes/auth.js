const express = require("express");
const { User, Cart } = require("../models");
const bcrypt = require("bcryptjs");
const formValidator = require("../utils/validation");
const mailer = require("../utils/mailer");
const router = express.Router();

router.use((req, res, next) => {
    console.log('Auth Route - Current Session:', req.session);
    next();
});

router.get("/log-in", (req, res) => {
    res.render("log-in", {
        title: "Log In",
        layout: "layouts/main"
    });
});

router.get("/sign-up", (req, res) => {
    res.render("sign-up", {
        title: "Sign Up",
        layout: "layouts/main",
        errors: null
    });
});

router.post("/log-in", async (req, res) => {
    try {
        const { email, password, role } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.render("log-in", {
                title: "Log In",
                layout: "layouts/main",
                error: "Invalid email or password"
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.render("log-in", {
                title: "Log In",
                layout: "layouts/main",
                error: "Invalid email or password"
            });
        }

        // Check if the user's role matches the selected role
        if (user.role !== role) {
            return res.render("log-in", {
                title: "Log In",
                layout: "layouts/main",
                error: "Invalid role selection"
            });
        }

        req.session.user = {
            _id: user._id,
            email: user.email,
            role: user.role,
            firstName: user.firstName
        };

        req.session.save((err) => {
            if (err) {
                console.error('Session save error:', err);
                return res.status(500).send('Error saving session');
            }

            if (user.role === 'clerk') {
                res.redirect('/inventory/list');
            } else {
                res.redirect('/');
            }
        });
    } catch (error) {
        console.error("Login error:", error);
        res.render("log-in", {
            title: "Log In",
            layout: "layouts/main",
            error: "An error occurred during login"
        });
    }
});

router.post("/register", async (req, res) => {
    try {
        const { email, password, firstName, lastName, role } = req.body;
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.render("sign-up", {
                title: "Sign Up",
                layout: "layouts/main",
                errors: [{ msg: "Email already exists" }]
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({
            email,
            password: hashedPassword,
            firstName,
            lastName,
            role: role || 'customer'
        });

        await user.save();

        req.session.user = {
            _id: user._id,
            email: user.email,
            role: user.role,
            firstName: user.firstName
        };

        req.session.save((err) => {
            if (err) {
                console.error('Session save error:', err);
                return res.status(500).send('Error saving session');
            }

            if (user.role === 'clerk') {
                res.redirect('/inventory/list');
            } else {
                res.redirect('/');
            }
        });
    } catch (error) {
        console.error("Registration error:", error);
        res.render("sign-up", {
            title: "Sign Up",
            layout: "layouts/main",
            errors: [{ msg: "An error occurred during registration" }]
        });
    }
});

router.get("/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Logout error:', err);
            return res.status(500).send('Error during logout');
        }
        res.redirect('/');
    });
});

router.get("/welcome", (req, res) => {
  res.render("welcome", { title: "Welcome!" });
});

router.get("/cart", (req, res) => {
    if (!req.session.user) {
        return res.redirect("/log-in");
    }
    res.render("cart", { 
        title: "Shopping Cart",
        items: [],
        subtotal: 0,
        tax: 0,
        total: 0,
        layout: "layouts/main",
        req: req
    });
});

module.exports = router;
