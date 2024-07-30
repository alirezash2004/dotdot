import express from "express";
import path from 'path';
import logger from "./api/v1.0/middleware/logger.js";
import v1_0 from './api/v1.0/versionRouter.js';
import { fileURLToPath } from 'url';
import cookieParser from "cookie-parser";
// import { __filename, __dirname } from './currentPath.js';

// server port
const PORT = process.env.PORT || 8000;

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const app = express();

app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
app.use(cookieParser(process.env.COOKIE_SECRET)) // request.cookies

app.use(logger); // Logger middleware

// setup static folder ::to_review
app.use(express.static('public'));

// Routes
app.use('/api/v1.0', v1_0);

app.listen(PORT, () => console.log(`\nServer is running on port ${PORT}\n`['blue']));