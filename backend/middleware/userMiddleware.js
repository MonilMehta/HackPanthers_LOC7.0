const { JWT_SECRET } = require('../config');
const jwt = require("jsonwebtoken");

const userMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(403).json({
                message: "Invalid authorization header"
            });
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, JWT_SECRET);
        
        req.username = decoded.username;
        
        next();
    } catch (err) {
        return res.status(403).json({
            message: "Invalid token"
        });
    }
}

module.exports = userMiddleware;