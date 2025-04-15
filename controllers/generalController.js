const express = require("express");
const productUtil = require("../Modules/product-util");
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
    res.render("sign-up", { title: "Sign Up", errors: null });
});

// Log-in route
router.get("/log-in", (req, res) => {
    res.render("log-in", { title: "Log In", errors: null });
});

exports.showLoginPage = (req, res) => {
    res.render('log-in', {
      error: req.flash('error') || ''
    });
  };

// Welcome route
router.get("/welcome", (req, res) => {
    res.render("welcome", { title: "Welcome!" });
});

module.exports = router;
