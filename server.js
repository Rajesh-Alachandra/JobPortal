import http from "http";
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import morgan from "morgan";
import { connectDB, sequelize } from './config/db.js';
import { errorHandler } from './middlewares/errorHandler.js';
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { initializeSocket } from "./utils/socket.js";
import setupSwagger from "./config/swagger.js";
import logger from "./utils/logger.js";
import employerRoutes from "./routes/employerRoutes.js";
import jobSeekerRoutes from "./routes/jobSeekerRoutes.js";


//!!!!! App
const app = express();
app.use(cors());
app.use(express.json());

//*** */ Get port from environment variable or use default
const PORT = process.env.PORT || 4000;

// ✅ Connect MySQL
await connectDB();
//  Sync Sequelize models
await sequelize.sync({ alter: true });


//TODO Get the current directory
const __filename = fileURLToPath(import.meta.url); //? Get the current file URL
const __dirname = path.dirname(__filename); //? Get the directory name

//TODO Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads'); //? Create the path to the uploads directory
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true }); //? Create the directory if it doesn't exist
}

//TODO Set up EJS
// Configure Express to use EJS as the templating engine
app.set('view engine', 'ejs'); // Set EJS as the view engine
app.set('views', path.join(__dirname, 'views'));


//***** Define routes
app.use('/api/jobseekers', jobSeekerRoutes);
app.use('/api/employers', employerRoutes);

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
    console.log(`Server running at http://localhost:${PORT}`);
});
