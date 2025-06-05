import Job from '../models/Jobs.js';
import Employer from '../models/Employer.js';
import { Op } from 'sequelize';

export const getAllJobs = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 10,
            timing,
            location,
            experience,
            search,
            category,
            isBookmarked
        } = req.query;

        const offset = (page - 1) * limit;
        const where = {};

        if (timing) where.timing = timing;
        if (location) where.location = { [Op.iLike]: `%${location}%` };
        if (experience) where.experience = { [Op.iLike]: `%${experience}%` };
        if (category) where.category = category;
        if (isBookmarked !== undefined) where.isBookmarked = isBookmarked === 'true';

        if (search) {
            where[Op.or] = [
                { title: { [Op.iLike]: `%${search}%` } },
                { companyName: { [Op.iLike]: `%${search}%` } },
                { location: { [Op.iLike]: `%${search}%` } }
            ];
        }

        const { count, rows } = await Job.findAndCountAll({
            where,
            include: [{
                model: Employer,
                as: 'employer',
                attributes: ['id', 'name', 'email']
            }],
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [['createdAt', 'DESC']]
        });

        res.status(200).json({
            success: true,
            data: {
                jobs: rows,
                pagination: {
                    currentPage: parseInt(page),
                    totalPages: Math.ceil(count / limit),
                    totalItems: count,
                    itemsPerPage: parseInt(limit)
                }
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching jobs',
            error: error.message
        });
    }
};

export const getJobById = async (req, res) => {
    try {
        const { id } = req.params;
        const job = await Job.findByPk(id, {
            include: [{
                model: Employer,
                as: 'employer'
            }]
        });

        if (!job) {
            return res.status(404).json({ success: false, message: 'Job not found' });
        }

        res.status(200).json({ success: true, data: job });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching job',
            error: error.message
        });
    }
};

export const createJob = async (req, res) => {
    try {
        const {
            title,
            description,
            companyName,
            location,
            salary,
            timing,
            experience,
            companyImg,
            jobPostTime,
            badges,
            category,
            employerId
        } = req.body;

        if (!title || !companyName || !location || !employerId) {
            return res.status(400).json({
                success: false,
                message: 'Title, company name, location, and employer ID are required'
            });
        }

        const employer = await Employer.findByPk(employerId);
        if (!employer) {
            return res.status(404).json({
                success: false,
                message: 'Employer not found'
            });
        }

        const job = await Job.create({
            title,
            description,
            companyName,
            location,
            salary,
            timing: timing || 'Full Time',
            experience,
            companyImg,
            jobPostTime: jobPostTime || 'Just now',
            badges: badges || [],
            category,
            employerId
        });

        const newJob = await Job.findByPk(job.id, {
            include: [{ model: Employer, as: 'employer' }]
        });

        res.status(201).json({
            success: true,
            message: 'Job created successfully',
            data: newJob
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error creating job',
            error: error.message
        });
    }
};

export const updateJob = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const job = await Job.findByPk(id);
        if (!job) {
            return res.status(404).json({
                success: false,
                message: 'Job not found'
            });
        }

        if (updateData.employerId) {
            const employer = await Employer.findByPk(updateData.employerId);
            if (!employer) {
                return res.status(404).json({
                    success: false,
                    message: 'Employer not found'
                });
            }
        }

        await job.update(updateData);

        const updatedJob = await Job.findByPk(id, {
            include: [{ model: Employer, as: 'employer' }]
        });

        res.status(200).json({
            success: true,
            message: 'Job updated successfully',
            data: updatedJob
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating job',
            error: error.message
        });
    }
};

export const deleteJob = async (req, res) => {
    try {
        const { id } = req.params;

        const job = await Job.findByPk(id);
        if (!job) {
            return res.status(404).json({
                success: false,
                message: 'Job not found'
            });
        }

        await job.destroy();

        res.status(200).json({
            success: true,
            message: 'Job deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting job',
            error: error.message
        });
    }
};

export const toggleBookmark = async (req, res) => {
    try {
        const { id } = req.params;

        const job = await Job.findByPk(id);
        if (!job) {
            return res.status(404).json({
                success: false,
                message: 'Job not found'
            });
        }

        await job.update({
            isBookmarked: !job.isBookmarked
        });

        res.status(200).json({
            success: true,
            message: `Job ${job.isBookmarked ? 'bookmarked' : 'unbookmarked'} successfully`,
            data: { isBookmarked: job.isBookmarked }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error toggling bookmark',
            error: error.message
        });
    }
};

export const getJobStats = async (req, res) => {
    try {
        const totalJobs = await Job.count();
        const fullTimeJobs = await Job.count({ where: { timing: 'Full Time' } });
        const partTimeJobs = await Job.count({ where: { timing: 'Part Time' } });
        const freelanceJobs = await Job.count({ where: { timing: 'Freelance' } });
        const internshipJobs = await Job.count({ where: { timing: 'Internship' } });
        const bookmarkedJobs = await Job.count({ where: { isBookmarked: true } });

        res.status(200).json({
            success: true,
            data: {
                totalJobs,
                jobsByType: {
                    fullTime: fullTimeJobs,
                    partTime: partTimeJobs,
                    freelance: freelanceJobs,
                    internship: internshipJobs
                },
                bookmarkedJobs
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching job statistics',
            error: error.message
        });
    }
};

export const createBulkJobs = async (req, res) => {
    try {
        const { jobs } = req.body;

        if (!Array.isArray(jobs) || jobs.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Jobs array is required and cannot be empty'
            });
        }

        const createdJobs = await Job.bulkCreate(jobs, {
            validate: true,
            returning: true
        });

        res.status(201).json({
            success: true,
            message: `${createdJobs.length} jobs created successfully`,
            data: createdJobs
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error creating bulk jobs',
            error: error.message
        });
    }
};


