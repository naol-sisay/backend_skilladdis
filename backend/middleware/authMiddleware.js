// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.verifyToken = (req, res, next) => {
    // 1. Look for the token in the request headers
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    // 2. Extract the actual token string (remove the word "Bearer ")
    const token = authHeader.split(' ')[1];

    try {
        // 3. Verify the token against your secret key
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // 4. Attach the decoded user data (user_id, role) to the request object
        // This allows the next function to know exactly who made the request
        req.user = decoded;
        
        // 5. Pass control to the next function (the actual route controller)
        next();
    } catch (error) {
        res.status(401).json({ error: 'Invalid or expired token.' });
    }
};

// Optional: Role-based middleware to strictly check for specific roles
exports.requireRole = (requiredRole) => {
    return (req, res, next) => {
        if (!req.user || req.user.role !== requiredRole) {
            return res.status(403).json({ error: `Access denied. Requires ${requiredRole} privileges.` });
        }
        next();
    };
};