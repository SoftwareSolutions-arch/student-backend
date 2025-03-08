const jwt = require('jsonwebtoken');
const config = require('../config/env');
const { tokenBlacklist } = require('../services/loginService');

module.exports = (req, res, next) => {
    const token = req.header('Authorization');

    if (!token) {
        return res.status(401).json({ message: 'Access Denied. No token provided.' });
    }

    if (tokenBlacklist.has(token)) {
        return res.status(401).json({ message: "Token is invalid (User logged out)" });
    }

    try {
        const extractedToken = token.replace('Bearer ', '');
        const decoded = jwt.verify(extractedToken, config.jwtSecret); // Use your JWT secret key
        req.user = decoded; // Add decoded user data to request
        next(); // Proceed to next middleware/controller
    } catch (error) {
        res.status(403).json({ message: 'Invalid or Expired Token' });
    }
};
