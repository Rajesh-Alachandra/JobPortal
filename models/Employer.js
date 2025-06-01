// models/Employer.js
import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';
import bcrypt from 'bcrypt';

const Employer = sequelize.define('Employer', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    companyName: {
        type: DataTypes.STRING(100),
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
    website: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    companySize: {
        type: DataTypes.ENUM('1-10', '11-50', '51-200', '201-500', '500+'),
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
    timestamps: true,
    hooks: {
        beforeCreate: async (employer) => {
            if (employer.password) {
                employer.password = await bcrypt.hash(employer.password, 10);
            }
        },
        beforeUpdate: async (employer) => {
            if (employer.changed('password')) {
                employer.password = await bcrypt.hash(employer.password, 10);
            }
        }
    }
});

// Method to compare entered password with hashed password
Employer.prototype.comparePassword = async function (password) {
    return bcrypt.compare(password, this.password);
};

export default Employer;
