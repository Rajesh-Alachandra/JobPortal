// routes/jobSeekerRoutes.js
import express from 'express';
import { registerJobSeeker, loginJobSeeker } from '../controllers/jobSeekerController.js';

const jobSeekerRoutes = express.Router();

jobSeekerRoutes.post('/register', registerJobSeeker);
jobSeekerRoutes.post('/login', loginJobSeeker);

export default jobSeekerRoutes;
