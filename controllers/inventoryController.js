const { Product } = require("../models");
const path = require("path");
const fs = require("fs");

const inventoryController = {
    // List all products
    listProducts: async (req, res) => {
        try {
            const products = await Product.find().sort({ title: 1 });
            res.render("inventory/list", {
                title: "Product List",
                products,
                user: req.session.user,
                layout: "layouts/main"
            });
        } catch (error) {
            console.error("Error fetching products:", error);
            res.status(500).render("error", {
                title: "Error",
                message: "Error fetching products",
                layout: "layouts/main"
            });
        }
    },

    // Show add product form
    showAddForm: (req, res) => {
        res.render("inventory/add", {
            title: "Add New Product",
            user: req.session.user,
            error: null,
            layout: "layouts/main",
            product: {},
        });
    },

    // Add new product
    addProduct: async (req, res) => {
        try {
            const { title, description, category, price, salePrice, shippingWeight, 
                    shippingWidth, shippingLength, shippingHeight, featured } = req.body;

            // Handle file upload
            let imageUrl = "";
            if (req.files && req.files.image) {
                const image = req.files.image;
                const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
                
                if (!allowedTypes.includes(image.mimetype)) {
                    return res.status(400).render("inventory/add", {
                        title: "Add Product - Error",
                        error: "Only JPG, PNG, and GIF images are allowed",
                        layout: "layouts/main"
                    });
                }

                const uploadDir = path.join(__dirname, "../public/images");
                if (!fs.existsSync(uploadDir)) {
                    fs.mkdirSync(uploadDir, { recursive: true });
                }

                const fileName = `${Date.now()}-${image.name}`;
                await image.mv(path.join(uploadDir, fileName));
                imageUrl = `/images/${fileName}`;
            }

            const product = new Product({
                title,
                description,
                category,
                price: parseFloat(price),
                salePrice: salePrice ? parseFloat(salePrice) : undefined,
                shippingWeight: parseInt(shippingWeight),
                shippingWidth: parseInt(shippingWidth),
                shippingLength: parseInt(shippingLength),
                shippingHeight: parseInt(shippingHeight),
                imageUrl,
                featured: featured === "on"
            });

            await product.save();
            res.redirect("/inventory/list");
        } catch (error) {
            console.error("Error adding product:", error);
            res.status(500).render("inventory/add", {
                title: "Add Product - Error",
                error: "Error adding product",
                layout: "layouts/main"
            });
        }
    },

    // Show edit form
    showEditForm: async (req, res) => {
        try {
            const product = await Product.findById(req.params.id);
            if (!product) {
                return res.status(404).render("error", {
                    title: "Not Found",
                    message: "Product not found",
                    layout: "layouts/main"
                });
            }
            res.render("inventory/edit", {
                title: "Edit Product",
                product,
                user: req.session.user,
                layout: "layouts/main"
            });
        } catch (error) {
            console.error("Error fetching product:", error);
            res.status(500).render("error", {
                title: "Error",
                message: "Error fetching product",
                layout: "layouts/main"
            });
        }
    },

    // Update product
    updateProduct: async (req, res) => {
        try {
            const { title, description, category, price, salePrice, shippingWeight, 
                    shippingWidth, shippingLength, shippingHeight, featured } = req.body;

            const product = await Product.findById(req.params.id);
            if (!product) {
                return res.status(404).render("error", {
                    title: "Not Found",
                    message: "Product not found",
                    layout: "layouts/main"
                });
            }

            // Handle file upload
            if (req.files && req.files.image) {
                const image = req.files.image;
                const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
                
                if (!allowedTypes.includes(image.mimetype)) {
                    return res.status(400).render("inventory/edit", {
                        title: "Edit Product - Error",
                        product,
                        error: "Only JPG, PNG, and GIF images are allowed",
                        layout: "layouts/main"
                    });
                }

                // Delete old image if exists
                if (product.imageUrl) {
                    const oldImagePath = path.join(__dirname, "../public", product.imageUrl);
                    if (fs.existsSync(oldImagePath)) {
                        fs.unlinkSync(oldImagePath);
                    }
                }

                const uploadDir = path.join(__dirname, "../public/images");
                if (!fs.existsSync(uploadDir)) {
                    fs.mkdirSync(uploadDir, { recursive: true });
                }

                const fileName = `${Date.now()}-${image.name}`;
                await image.mv(path.join(uploadDir, fileName));
                product.imageUrl = `/images/${fileName}`;
            }

            // Update product fields
            product.title = title;
            product.description = description;
            product.category = category;
            product.price = parseFloat(price);
            product.salePrice = salePrice ? parseFloat(salePrice) : undefined;
            product.shippingWeight = parseInt(shippingWeight);
            product.shippingWidth = parseInt(shippingWidth);
            product.shippingLength = parseInt(shippingLength);
            product.shippingHeight = parseInt(shippingHeight);
            product.featured = featured === "on";

            await product.save();
            res.redirect("/inventory/list");
        } catch (error) {
            console.error("Error updating product:", error);
            res.status(500).render("inventory/edit", {
                title: "Edit Product - Error",
                product: req.body,
                error: "Error updating product",
                layout: "layouts/main"
            });
        }
    },

    // Show delete confirmation
    showDeleteForm: async (req, res) => {
        try {
            const product = await Product.findById(req.params.id);
            if (!product) {
                return res.status(404).render("error", {
                    title: "Not Found",
                    message: "Product not found",
                    layout: "layouts/main"
                });
            }
            res.render("inventory/delete", {
                title: "Delete Product",
                product,
                user: req.session.user,
                layout: "layouts/main"
            });
        } catch (error) {
            console.error("Error fetching product:", error);
            res.status(500).render("error", {
                title: "Error",
                message: "Error fetching product",
                layout: "layouts/main"
            });
        }
    },

    // Delete product
    deleteProduct: async (req, res) => {
        try {
            const product = await Product.findById(req.params.id);
            if (!product) {
                return res.status(404).render("error", {
                    title: "Not Found",
                    message: "Product not found",
                    layout: "layouts/main"
                });
            }

            // Delete image file if exists
            if (product.imageUrl) {
                const imagePath = path.join(__dirname, "../public", product.imageUrl);
                if (fs.existsSync(imagePath)) {
                    fs.unlinkSync(imagePath);
                }
            }

            await Product.findByIdAndDelete(req.params.id);
            res.redirect("/inventory/list");
        } catch (error) {
            console.error("Error deleting product:", error);
            res.status(500).render("error", {
                title: "Error",
                message: "Error deleting product",
                layout: "layouts/main"
            });
        }
    }
};

module.exports = inventoryController;
