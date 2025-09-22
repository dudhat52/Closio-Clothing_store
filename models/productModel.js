const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  salePrice: { type: Number },
  imageUrl: { type: String, required: true },
  featured: { type: Boolean, required: true }
});

module.exports = mongoose.model("Product", productSchema);
