const isClerk = (req, res, next) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }
    if (req.session.user.role !== 'clerk') {
        return res.status(403).render('error', { 
            message: 'Access denied. Only clerks can access this page.',
            error: { status: 403 }
        });
    }
    next();
};

const isLoggedIn = (req, res, next) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }
    next();
};

module.exports = { isClerk, isLoggedIn }; 