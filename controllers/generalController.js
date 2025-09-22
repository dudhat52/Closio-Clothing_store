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



module.exports = router;
