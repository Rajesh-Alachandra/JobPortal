// controllers/employerController.js
import { generateToken } from '../config/jwt.js';
import Employer from '../models/Employer.js';


// Register Employer
export const registerEmployer = async (req, res) => {
    try {
        const { companyName, email, password, phone } = req.body;
        // Check if employer already exists
        const existingEmployer = await Employer.findOne({ where: { email } });
        if (existingEmployer) {
            return res.status(400).json({ message: 'Employer already exists' });
        }

        // Create employer
        const employer = await Employer.create({ companyName, email, password, phone });

        res.status(201).json({ message: 'Employer registered successfully', employer });
    } catch (error) {
        console.error('Register Error:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// Login Employer
export const loginEmployer = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find employer
        const employer = await Employer.findOne({ where: { email } });
        if (!employer) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Compare password
        const isMatch = await employer.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Generate JWT Token
        const token = generateToken({ id: employer.id, email: employer.email, role: 'employer' });

        res.json({
            message: 'Login successful',
            token,
            employer: {
                id: employer.id,
                companyName: employer.companyName,
                email: employer.email,
                isVerified: employer.isVerified
            }
        });
    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};
