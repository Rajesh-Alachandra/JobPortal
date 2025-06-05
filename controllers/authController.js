// controllers/authController.js
import { User, JobSeeker, Employer } from '../models/index.js';
import { sequelize } from '../config/db.js';
import { generateToken } from '../config/jwt.js';



// Unified Login Controller
export const login = async (req, res) => {
    const transaction = await sequelize.transaction();

    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required'
            });
        }

        // Find user
        const user = await User.findOne({
            where: { email, isActive: true },
            include: [
                { model: JobSeeker, as: 'jobSeekerProfile' },
                { model: Employer, as: 'employerProfile' }
            ]
        });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Check password
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Update last login
        user.lastLogin = new Date();
        await user.save({ transaction });

        // Generate token
        const token = generateToken(user.id, user.role);

        // Prepare response data
        let profileData = {};
        if (user.role === 'jobseeker' && user.jobSeekerProfile) {
            profileData = {
                firstName: user.jobSeekerProfile.firstName,
                lastName: user.jobSeekerProfile.lastName,
                phone: user.jobSeekerProfile.phone,
                profileImage: user.jobSeekerProfile.profileImage
            };
        } else if (user.role === 'employer' && user.employerProfile) {
            profileData = {
                companyName: user.employerProfile.companyName,
                phone: user.employerProfile.phone,
                isVerified: user.employerProfile.isVerified,
                profileImage: user.employerProfile.profileImage
            };
        }

        await transaction.commit();

        res.status(200).json({
            success: true,
            message: 'Login successful',
            data: {
                token,
                user: {
                    id: user.id,
                    email: user.email,
                    role: user.role,
                    ...profileData
                }
            }
        });

    } catch (error) {
        await transaction.rollback();
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// JobSeeker Registration
export const registerJobSeeker = async (req, res) => {
    const transaction = await sequelize.transaction();

    try {
        const {
            email,
            password,
            firstName,
            lastName,
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
        } = req.body;

        // Validate required fields
        if (!email || !password || !firstName || !lastName) {
            return res.status(400).json({
                success: false,
                message: 'Email, password, first name, and last name are required'
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: 'User with this email already exists'
            });
        }

        // Create user
        const user = await User.create({
            email,
            password,
            role: 'jobseeker'
        }, { transaction });

        // Create job seeker profile
        const jobSeeker = await JobSeeker.create({
            userId: user.id,
            firstName,
            lastName,
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
        }, { transaction });

        await transaction.commit();

        // Generate token
        const token = generateToken(user.id, user.role);

        res.status(201).json({
            success: true,
            message: 'Job seeker registered successfully',
            data: {
                token,
                user: {
                    id: user.id,
                    email: user.email,
                    role: user.role,
                    firstName: jobSeeker.firstName,
                    lastName: jobSeeker.lastName,
                    phone: jobSeeker.phone
                }
            }
        });

    } catch (error) {
        await transaction.rollback();
        console.error('JobSeeker registration error:', error);

        if (error.name === 'SequelizeValidationError') {
            return res.status(400).json({
                success: false,
                message: 'Validation error',
                errors: error.errors.map(err => err.message)
            });
        }

        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// Employer Registration
export const registerEmployer = async (req, res) => {
    const transaction = await sequelize.transaction();

    try {
        const {
            email,
            password,
            companyName,
            phone,
            website,
            companySize,
            industry,
            description,
            address,
            city,
            state,
            country
        } = req.body;

        // Validate required fields
        if (!email || !password || !companyName) {
            return res.status(400).json({
                success: false,
                message: 'Email, password, and company name are required'
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: 'User with this email already exists'
            });
        }

        // Create user
        const user = await User.create({
            email,
            password,
            role: 'employer'
        }, { transaction });

        // Create employer profile
        const employer = await Employer.create({
            userId: user.id,
            companyName,
            phone,
            website,
            companySize,
            industry,
            description,
            address,
            city,
            state,
            country
        }, { transaction });

        await transaction.commit();

        // Generate token
        const token = generateToken(user.id, user.role);

        res.status(201).json({
            success: true,
            message: 'Employer registered successfully',
            data: {
                token,
                user: {
                    id: user.id,
                    email: user.email,
                    role: user.role,
                    companyName: employer.companyName,
                    phone: employer.phone,
                    isVerified: employer.isVerified
                }
            }
        });

    } catch (error) {
        await transaction.rollback();
        console.error('Employer registration error:', error);

        if (error.name === 'SequelizeValidationError') {
            return res.status(400).json({
                success: false,
                message: 'Validation error',
                errors: error.errors.map(err => err.message)
            });
        }

        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// Get Current User Profile
export const getCurrentUser = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id, {
            include: [
                { model: JobSeeker, as: 'jobSeekerProfile' },
                { model: Employer, as: 'employerProfile' }
            ]
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        let profileData = {
            id: user.id,
            email: user.email,
            role: user.role,
            lastLogin: user.lastLogin
        };

        if (user.role === 'jobseeker' && user.jobSeekerProfile) {
            profileData.profile = user.jobSeekerProfile;
        } else if (user.role === 'employer' && user.employerProfile) {
            profileData.profile = user.employerProfile;
        }

        res.status(200).json({
            success: true,
            data: profileData
        });

    } catch (error) {
        console.error('Get current user error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};
