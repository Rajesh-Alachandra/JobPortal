// src/middlewares/authMiddleware.js
import { verifyToken } from '../config/jwt.js';

export const authenticate = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Unauthorized' });

    try {
        req.user = verifyToken(token);
        next();
    } catch (error) {
        res.status(403).json({ message: 'Forbidden' });
    }
};