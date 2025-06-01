// routes/employerRoutes.js
import express from 'express';
import { registerEmployer, loginEmployer } from '../controllers/employerController.js';

const employerRoutes = express.Router();

// POST /api/employers/register
employerRoutes.post('/register', registerEmployer);

// POST /api/employers/login
employerRoutes.post('/login', loginEmployer);

export default employerRoutes;
