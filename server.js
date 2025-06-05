// Updated server.js
import http from "http";
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import morgan from "morgan";
import { connectDB } from './config/db.js';
import { syncDatabase } from './models/index.js'; // Import proper sync function
import { errorHandler } from './middlewares/errorHandler.js';
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { initializeSocket } from "./utils/socket.js";
import setupSwagger from "./config/swagger.js";
import logger from "./utils/logger.js";
import authRoutes from "./routes/auth.js"; // Add auth routes

//!!!!! App
const app = express();
app.use(cors());
app.use(express.json());

//*** */ Get port from environment variable or use default
const PORT = process.env.PORT || 4000;

// ✅ Connect MySQL
await connectDB();

// 🔄 Sync Sequelize models in proper order
await syncDatabase(); // Use the proper sync function

//TODO Get the current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//TODO Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

//TODO Set up EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//***** Define routes
app.use('/api/auth', authRoutes); // Add auth routes


//****** */ Serve static files from 'uploads' folder
app.use('/uploads', express.static(uploadsDir));

//***** */ Error handler middleware
app.use(errorHandler);

// Swagger setup
setupSwagger(app);

//! Simple route for testing API
app.get('/', (req, res) => {
    res.render('index', { title: 'Home Page' });
});

const morganFormat = ":method :url :status :response-time ms";
app.use(
    morgan(morganFormat, {
        stream: {
            write: (message) => {
                const logObject = {
                    method: message.split(" ")[0],
                    url: message.split(" ")[1],
                    status: message.split(" ")[2],
                    responseTime: message.split(" ")[3],
                };
                logger.info(JSON.stringify(logObject));
            },
        },
    })
);

//! Create an HTTP Server
const server = http.createServer(app);

//! Initialize Socket.IO
initializeSocket(server);

//! Start Server
server.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
    console.log(`📚 API Documentation: http://localhost:${PORT}/api-docs`);
});