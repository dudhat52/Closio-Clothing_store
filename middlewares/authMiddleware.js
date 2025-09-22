const isClerk = (req, res, next) => {
    if (!req.session.user || req.session.user.role !== 'clerk') {
        req.flash('error_msg', 'You are not authorized to access this page');
        return res.redirect('/');
    }
    next();
};

const isLoggedIn = (req, res, next) => {
    if (!req.session.user) {
        req.flash('error_msg', 'Please log in to access this page');
        return res.redirect('/auth/log-in');
    }
    next();
};

module.exports = {
    isLoggedIn,
    isClerk
}; 