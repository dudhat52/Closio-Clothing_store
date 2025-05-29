const express = require("express");
const router = express.Router();
const { Product } = require("../models");

// Home route
router.get("/", async (req, res) => {
    try {
        const products = await Product.find().sort({ createdAt: -1 });
        res.render("home", { 
            title: "Home", 
            products: products,
            layout: "layouts/main",
            user: req.session.user || null
        });
    } catch (error) {
        console.error("Error fetching products:", error);
        res.render("home", { 
            title: "Home", 
            products: [],
            layout: "layouts/main",
            user: req.session.user || null
        });
    }
});

// Sign-up route
router.get("/sign-up", (req, res) => {
    res.render("sign-up", { 
        title: "Sign Up", 
        errors: null,
        error_msg: req.flash('error_msg'),
        success_msg: req.flash('success_msg')
    });
});

// Log-in route
router.get("/log-in", (req, res) => {
    res.render("log-in", { 
        title: "Log In", 
        errors: null,
        error_msg: req.flash('error_msg'),
        success_msg: req.flash('success_msg')
    });
});

// Welcome route
router.get("/welcome", (req, res) => {
    res.render("welcome", { title: "Welcome!" });
});

module.exports = router;
