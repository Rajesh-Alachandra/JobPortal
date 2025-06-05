import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';
import Employer from './Employer.js';

const Job = sequelize.define('Job', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'job_description' // Maps to jobDescription from your data
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    companyName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    location: {
        type: DataTypes.STRING,
        allowNull: false
    },
    salary: {
        type: DataTypes.DECIMAL,
        allowNull: true
    },
    timing: {
        type: DataTypes.ENUM('Full Time', 'Part Time', 'Freelance', 'Internship'),
        allowNull: false,
        defaultValue: 'Full Time'
    },
    experience: {
        type: DataTypes.STRING,
        allowNull: true
    },
    companyImg: {
        type: DataTypes.STRING,
        allowNull: true
    },
    jobPostTime: {
        type: DataTypes.STRING,
        allowNull: true
    },
    isBookmarked: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        field: 'add_class_name_bookmark'
    },
    badges: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: []
    },
    isFullTime: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    isPartTime: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    isFreelance: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    isInternship: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    category: {
        type: DataTypes.STRING,
        allowNull: true
    },
    employerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Employers',
            key: 'id'
        }
    }
}, {
    tableName: 'Jobs',
    timestamps: true,
    hooks: {
        beforeSave: (job) => {
            // Auto-set boolean flags based on timing
            job.isFullTime = job.timing === 'Full Time';
            job.isPartTime = job.timing === 'Part Time';
            job.isFreelance = job.timing === 'Freelance';
            job.isInternship = job.timing === 'Internship';
        }
    }
});

// Association
Job.belongsTo(Employer, { foreignKey: 'employerId', as: 'employer' });
Employer.hasMany(Job, { foreignKey: 'employerId', as: 'jobs' });

export default Job;