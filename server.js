<<<<<<< HEAD
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

const path = require("path");
const express = require("express");
const app = express();

// Add your routes here
// e.g. app.get() { ... }
app.use('/', routes);

// This use() will not allow requests to go beyond it
// so we place it at the end of the file, after the other routes.
// This function will catch all other requests that don't match
// any other route handlers declared before it.
// This means we can use it as a sort of 'catch all' when no route match is found.
// We use this function to handle 404 requests to pages that are not found.
app.use((req, res) => {
    res.status(404).send("Page Not Found");
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
=======
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const path = require('path');
const productUtil = require('./modules/product-util').default;

const app = express();
const port = 3000;

// 1. Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// 2. Configure EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');
app.set('layout', 'layouts/main');  
app.set('views', path.join(__dirname, 'views'));

// 3. Routes
app.get('/', (req, res) => {
  res.render('home', {
    title: 'CLOSIO - Home',
    featuredProducts: productUtil.getFeaturedProducts()
  });
});

app.get('/log-in', (req, res) => {
    res.render('log-in', { title: 'CLOSIO - Log In' }); // Renders log-in.ejs
});

app.get('/sign-up', (req, res) => {
    res.render('sign-up', { title: 'CLOSIO - Sign Up' }); // Renders sign-up.ejs
});

app.get('/', (req, res) => {
    res.render('home', {
        title: 'CLOSIO - Home',
        featuredProducts: productUtil.getFeaturedProducts()
    });
});

app.get('/inventory', (req, res) => {
    res.render('inventory', {
        title: 'CLOSIO - Inventory',
        categories: productUtil.getProductsByCategory(productUtil.getAllProducts())
    });
});
app.listen(port, () => {
  console.log(`Server running: http://localhost:${port}`);
});
>>>>>>> f64517c (updated file with new changes)
