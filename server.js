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
const app = express(); 
const path = require("path");
const express = require("express");
const expressLayouts = require('express-ejs-layouts');
const productUtil = require('./Modules/product-util').default;

app.set('view engine', 'ejs');
app.set('layout', 'layouts/main');  
app.set('views', path.join(__dirname, 'views'));
app.use(express.static('public'));
app.use(expressLayouts);
app.use(express.static(path.join(__dirname, 'public'))); 

// Routes
app.get('/', (req, res) => {
  res.render('home', {
    title: 'CLOSIO - Home',
    featuredProducts: productUtil.getFeaturedProducts()
  });
});

app.get('/log-in', (req, res) => {
    res.render('log-in', { title: 'CLOSIO - Log In' });
});

app.get('/sign-up', (req, res) => {
    res.render('sign-up', { title: 'CLOSIO - Sign Up' });
});

app.get('/inventory', (req, res) => {
    res.render('inventory', {
        title: 'CLOSIO - Inventory',
        categories: productUtil.getProductsByCategory(productUtil.getAllProducts())
    });
});

// This use() will add an error handler function to
// catch all errors.
app.use(function (err, req, res, next) {
    console.error(err.stack)
    res.status(500).send("Something broke!")
});


// *** DO NOT MODIFY THE LINES BELOW ***

// Define a port to listen to requests on.
const HTTP_PORT = process.env.PORT || 8080;

// Call this function after the http server starts listening for requests.
function onHttpStart() {
    console.log("Express http server listening on: " + HTTP_PORT);
}
  
// Listen on port 8080. The default port for http is 80, https is 443. We use 8080 here
// because sometimes port 80 is in use by other applications on the machine
app.listen(HTTP_PORT, onHttpStart);