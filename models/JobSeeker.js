// models/JobSeeker.js

import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';
import bcrypt from 'bcrypt';

const JobSeeker = sequelize.define('JobSeeker', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    firstName: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    lastName: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    password: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    phone: {
        type: DataTypes.STRING(15),
        allowNull: true
    },
    dateOfBirth: {
        type: DataTypes.DATEONLY,
        allowNull: true
    },
    gender: {
        type: DataTypes.ENUM('Male', 'Female', 'Other'),
        allowNull: true
    },
    address: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    city: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    state: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    country: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    skills: {
        type: DataTypes.TEXT,
        allowNull: true,
        get() {
            const value = this.getDataValue('skills');
            return value ? JSON.parse(value) : [];
        },
        set(value) {
            this.setDataValue('skills', JSON.stringify(value));
        }
    },
    experience: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'Experience in years'
    },
    education: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    currentJobTitle: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    expectedSalary: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true
    },
    resume: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: 'Resume file path'
    },
    profileImage: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    timestamps: true,
    hooks: {
        beforeCreate: async (jobSeeker) => {
            if (jobSeeker.password) {
                jobSeeker.password = await bcrypt.hash(jobSeeker.password, 10);
            }
        },
        beforeUpdate: async (jobSeeker) => {
            if (jobSeeker.changed('password')) {
                jobSeeker.password = await bcrypt.hash(jobSeeker.password, 10);
            }
        }
    }
});

// Compare hashed password
JobSeeker.prototype.comparePassword = async function (password) {
    return bcrypt.compare(password, this.password);
};

export default JobSeeker;
