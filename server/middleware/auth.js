const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');

// Protect routes - verify access token from cookie or Authorization header
const protect = asyncHandler(async (req, res, next) => {
    let token;

    // Check Authorization header Bearer token first
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
        token = req.headers.authorization.split(' ')[1];
    }
    // Fallback: HTTP-only cookie
    else if (req.cookies && req.cookies.accessToken) {
        token = req.cookies.accessToken;
    }

    if (!token) {
        res.status(401);
        throw new Error('Not authorized, no token provided');
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
        req.user = await User.findById(decoded.id).select('-password -refreshToken');
        if (!req.user) {
            res.status(401);
            throw new Error('User not found');
        }
        next();
    } catch (error) {
        res.status(401);
        throw new Error('Not authorized, token invalid or expired');
    }
});

module.exports = { protect };
