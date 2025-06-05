// routes/jobRoutes.js
import express from 'express';

import {
    getAllJobs,
    getJobStats,
    getJobById,
    createJob,
    createBulkJobs,
    updateJob,
    toggleBookmark,
    deleteJob
} from '../controllers/jobController.js';


const router = express.Router();

// GET routes
router.get('/', getAllJobs);                    // GET /jobs
router.get('/stats', getJobStats);              // GET /jobs/stats
router.get('/:id', getJobById);                 // GET /jobs/:id

// POST routes
router.post('/', createJob);                    // POST /jobs
router.post('/bulk', createBulkJobs);           // POST /jobs/bulk

// PUT routes
router.put('/:id', updateJob);                  // PUT /jobs/:id

// PATCH routes
router.patch('/:id/bookmark', toggleBookmark);  // PATCH /jobs/:id/bookmark

// DELETE routes
router.delete('/:id', deleteJob);               // DELETE /jobs/:id

export default router;
