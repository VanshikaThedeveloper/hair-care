// Admin role guard - must be used after protect middleware
const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403);
        throw new Error('Access denied. Admin role required.');
    }
};

module.exports = { isAdmin };
