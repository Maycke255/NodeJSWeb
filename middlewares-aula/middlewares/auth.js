const authMiddleware = (req, res, next) => {
    if (req.session.authenticated) {
        next();
    } else {
        res.redirect('/index');
    }
}

module.exports = authMiddleware;