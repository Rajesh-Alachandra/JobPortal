// controllers/jobSeekerController.js
import { generateToken } from '../config/jwt.js';
import JobSeeker from '../models/JobSeeker.js';


// Register JobSeeker
export const registerJobSeeker = async (req, res) => {
    try {
        const {
            firstName, lastName, email, password, phone, dateOfBirth,
            gender, address, city, state, country, skills, experience,
            education, currentJobTitle, expectedSalary
        } = req.body;

        // Check if user already exists
        const existing = await JobSeeker.findOne({ where: { email } });
        if (existing) {
            return res.status(400).json({ message: 'Job Seeker already exists' });
        }

        // Create Job Seeker
        const jobSeeker = await JobSeeker.create({
            firstName,
            lastName,
            email,
            password,
            phone,
            dateOfBirth,
            gender,
            address,
            city,
            state,
            country,
            skills,
            experience,
            education,
            currentJobTitle,
            expectedSalary
        });

        res.status(201).json({ message: 'Job Seeker registered successfully', jobSeeker });
    } catch (error) {
        console.error('Register Error:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// Login JobSeeker
export const loginJobSeeker = async (req, res) => {
    try {
        const { email, password } = req.body;

        const jobSeeker = await JobSeeker.findOne({ where: { email } });
        if (!jobSeeker) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const isMatch = await jobSeeker.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const token = generateToken({ id: jobSeeker.id, email: jobSeeker.email, role: 'jobseeker' });

        res.json({
            message: 'Login successful',
            token,
            jobSeeker: {
                id: jobSeeker.id,
                name: `${jobSeeker.firstName} ${jobSeeker.lastName}`,
                email: jobSeeker.email,
                isActive: jobSeeker.isActive
            }
        });
    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};
