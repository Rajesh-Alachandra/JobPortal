// Updated models/Employer.js
import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const Employer = sequelize.define('Employer', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'id'
        },
        onDelete: 'CASCADE'
    },
    companyName: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    phone: {
        type: DataTypes.STRING(15),
        allowNull: true
    },
    website: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    companySize: {
        // type: DataTypes.ENUM('1-10', '11-50', '51-200', '201-500', '500+'),
        type: DataTypes.STRING(255),
        allowNull: true
    },
    industry: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    description: {
        type: DataTypes.TEXT,
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
    isVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    profileImage: {
        type: DataTypes.STRING(255),
        allowNull: true
    }
}, {
    timestamps: true
});

export default Employer;