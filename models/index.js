// models/index.js
import { sequelize } from '../config/db.js';
import User from './User.js';
import JobSeeker from './JobSeeker.js';
import Employer from './Employer.js';

// Define associations
User.hasOne(JobSeeker, {
    foreignKey: 'userId',
    as: 'jobSeekerProfile',
    onDelete: 'CASCADE'
});

User.hasOne(Employer, {
    foreignKey: 'userId',
    as: 'employerProfile',
    onDelete: 'CASCADE'
});

JobSeeker.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user'
});

Employer.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user'
});

// Sync models in correct order
export const syncDatabase = async () => {
    try {
        console.log('🔄 Starting database synchronization...');

        // Sync User table first (parent table)
        await User.sync({ alter: true });
        console.log('✅ User table synced successfully');

        // Then sync dependent tables
        await JobSeeker.sync({ alter: true });
        console.log('✅ JobSeeker table synced successfully');

        await Employer.sync({ alter: true });
        console.log('✅ Employer table synced successfully');

        console.log('🎉 All models synced successfully');
    } catch (error) {
        console.error('❌ Database sync error:', error);
        throw error;
    }
};

// For development - drops and recreates all tables
export const syncDatabaseFresh = async () => {
    try {
        console.log('🔄 Dropping and recreating all tables...');

        // Drop all tables (be careful - this deletes all data!)
        await sequelize.drop();
        console.log('🗑️ All tables dropped');

        // Recreate all tables with associations
        await sequelize.sync({ force: true });
        console.log('🎉 All tables recreated successfully');

    } catch (error) {
        console.error('❌ Database fresh sync error:', error);
        throw error;
    }
};

export { User, JobSeeker, Employer };