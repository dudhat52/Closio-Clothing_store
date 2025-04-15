require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const fileUpload = require("express-fileupload");
const path = require("path");
const expressLayouts = require("express-ejs-layouts");
const authRoutes = require("./routes/auth");
const inventoryRoutes = require("./routes/inventoryRoutes");
const loadDataRoutes = require("./routes/loadDataRoutes");
const cartRoutes = require("./routes/cartRoutes");
const generalController = require("./controllers/generalController");

const app = express();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ MongoDB connected"))
    .catch(err => console.error("❌ MongoDB connection error:", err));

// Set up EJS with layouts
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(expressLayouts);
app.set("layout", "layouts/main");

// Serve static files
app.use(express.static(path.join(__dirname, "public")));
app.use("/assets", express.static(path.join(__dirname, "assets")));

// Body parsing middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(fileUpload());

// Session configuration
app.use(session({
    secret: "secureSecret",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI,
        ttl: 24 * 60 * 60 // Session TTL of 1 day
    }),
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 // 1 day
    }
}));

// Make user data available to all views
app.use((req, res, next) => {
    console.log('Current session user:', req.session.user);
    res.locals.user = req.session.user;
    next();
});

// Auth routes should come first
app.use("/auth", authRoutes);

// Protected routes
app.use((req, res, next) => {
    // Paths that don't require authentication
    const publicPaths = ['/log-in', '/sign-up', '/'];
    
    if (!req.session.user && !publicPaths.includes(req.path)) {
        return res.redirect('/auth/log-in');
    }
    next();
});

// Routes
app.use("/", generalController);
app.use("/inventory", inventoryRoutes);
app.use("/load-data", loadDataRoutes);
app.use("/cart", cartRoutes);

// 404 Handler - should be last
app.use((req, res) => {
    console.log('404 - Not Found:', req.path);
    res.status(404).render('404', {
        title: 'Page Not Found',
        layout: 'layouts/main'
    });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));