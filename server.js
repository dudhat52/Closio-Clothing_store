/*************************************************************************************
* WEB322 - 2251 Project
* I declare that this assignment is my own work in accordance with the Seneca Academic
* Policy. No part of this assignment has been copied manually or electronically from
* any other source (including web sites) or distributed to other students.
*
* Student Name  : Dish Dudhat
* Student ID    : 143046233
* Student Email : dhdudhat@myseneca.ca
* Course/Section: WEB322/NFF
*
**************************************************************************************/
require("dotenv").config();
const express = require("express");
const path = require("path");
const expressLayouts = require("express-ejs-layouts");
const authRoutes = require("./routes/auth");
const productUtil = require("./Modules/product-util");

const app = express();
app.set("view engine", "ejs");
app.set("layout", "layouts/main");
app.set("views", path.join(__dirname, "views"));

app.use(express.static("public"));
app.use(expressLayouts);
app.use(express.urlencoded({ extended: true })); // Parse form data

// Routes
app.use("/auth", authRoutes);

app.get("/", (req, res) => {
  res.render("home", { 
    title: "Home",
    featuredProducts: productUtil.getFeaturedProducts() 
  });
});

app.get("/welcome", (req, res) => {
  res.render("welcome", { title: "Welcome!" });
});

app.get("/dashboard", (req, res) => {
  res.render("dashboard", { title: "User Dashboard" });
});

app.get("/log-in", (req, res) => {
  res.render("log-in", { title: "Log In", errors: null });
});

app.get("/sign-up", (req, res) => {
  res.render("sign-up", { title: "Sign Up", errors: null });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).send("Page Not Found");
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
