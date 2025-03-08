const jwt = require("jsonwebtoken");
const User = require("../models/registerModel");

const authMiddleware = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({ message: "Access Denied. No token provided." });
        }

        const extractedToken = token.replace("Bearer ", "").trim();
        const decoded = jwt.verify(extractedToken, process.env.JWT_SECRET);

        const user = await User.findById(decoded.id);
        
        if (!user) {
            return res.status(401).json({ message: "Invalid or expired token. Please log in again." });
        }

        if ( user.token !== extractedToken) {
            
            return res.status(401).json({ message: "Session Expired. Please log in again." });
        }

        req.user = user;
        next();
    } catch (error) {
        res.status(403).json({ message: "Invalid or Expired Token" });
    }
};

module.exports = authMiddleware;
