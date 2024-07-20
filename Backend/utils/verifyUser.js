const errorHandlers = require('../utils/errorHandler');
const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const token = req.cookies.access_token;
    if (!token) {
        return next(errorHandlers(401, 'Unauthorized: No token provided'));
    }

    jwt.verify(token, process.env.JWT_SECRET, (error, user) => {
        if (error) {
            return next(errorHandlers(401, 'Unauthorized: Invalid token'));
        }
        req.user = user;
        next();
    });
}

module.exports = verifyToken;

