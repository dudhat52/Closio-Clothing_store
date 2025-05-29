require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const fileUpload = require("express-fileupload");
const path = require("path");
const expressLayouts = require("express-ejs-layouts");
const flash = require('connect-flash');
const authRoutes = require("./routes/auth");
const inventoryRoutes = require("./routes/inventoryRoutes");
const cartRoutes = require("./routes/cartRoutes");
const generalController = require("./controllers/generalController");

const app = express();

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ MongoDB connected"))
    .catch(err => console.error("❌ MongoDB connection error:", err));

app.set('trust proxy', 1);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(expressLayouts);
app.set("layout", "layouts/main");
app.use(express.static(path.join(__dirname, "public")));
app.use("/assets", express.static(path.join(__dirname, "assets")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(fileUpload());

app.use(session({
    secret: process.env.SESSION_SECRET || "secureSecret",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI,
        ttl: 24 * 60 * 60 // 1 day
    }),
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        maxAge: 24 * 60 * 60 * 1000 // 1 day
    }
}));

// Add flash middleware
app.use(flash());

// Make flash messages available to all views
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.path = req.path;
    next();
});

app.use((req, res, next) => {
    console.log('Current session user:', req.session.user);
    res.locals.user = req.session.user;
    next();
});

app.use("/auth", authRoutes);

app.use((req, res, next) => {
    const publicPaths = ['/log-in', '/sign-up', '/'];
    if (!req.session.user && !publicPaths.includes(req.path)) {
        return res.redirect('/auth/log-in');
    }
    next();
});

app.use("/", generalController);
app.use("/inventory", inventoryRoutes);
app.use("/cart", cartRoutes);
app.use((req, res) => {
    console.log('404 - Not Found:', req.path);
    res.status(404).render('404', {
        title: 'Page Not Found',
        layout: 'layouts/main'
    });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));