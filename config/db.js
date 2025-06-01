// config/db.js
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

export const sequelize = new Sequelize(
    process.env.DB_NAME || 'testdb',
    process.env.DB_USER || 'root',
    process.env.DB_PASSWORD || 'Rajesh@001',
    {
        host: process.env.DB_HOST || 'localhost',
        dialect: 'mysql',
        pool: {
            max: 10,
            min: 0,
            acquire: 30000,
            idle: 10000,
        },
        logging: false, // Disable SQL logs or set to `console.log` to enable
    }
);

// Test the connection
export const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ Sequelize connected to MySQL...');
    } catch (error) {
        console.error('❌ Sequelize connection error:', error.message);
        process.exit(1);
    }
};
