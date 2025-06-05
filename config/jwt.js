// src/config/jwt.js
import jwt from 'jsonwebtoken';

export const generateToken = (userId, role) => {
    return jwt.sign(
        { id: userId, role },
        process.env.JWT_SECRET || 'random#JWTTokenSecret',
        { expiresIn: '24h' }
    );
};

export const verifyToken = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET);
};