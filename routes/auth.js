// routes/auth.js
import express from 'express';
import {
    login,
    registerJobSeeker,
    registerEmployer,
    getCurrentUser
} from '../controllers/authController.js';
import { authenticateToken } from '../middlewares/auth.js';

const router = express.Router();

// Authentication routes
router.post('/login', login);
router.post('/register/jobseeker', registerJobSeeker);
router.post('/register/employer', registerEmployer);
router.get('/me', authenticateToken, getCurrentUser);

export default router;