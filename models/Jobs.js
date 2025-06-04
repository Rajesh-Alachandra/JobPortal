import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js'; // Make sure the path and filename include `.js` extension
import Employer from './Employer.js'; // Also make sure Employer is an ES module

const Job = sequelize.define('Job', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
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
    timestamps: true
});

// Association
Job.belongsTo(Employer, { foreignKey: 'employerId', as: 'employer' });
Employer.hasMany(Job, { foreignKey: 'employerId', as: 'jobs' });

export default Job;
