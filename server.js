import express from "express";
import path from 'path';
import logger from "./api/v1.0/middleware/logger.js";
import v1_0 from './api/v1.0/versionRouter.js';
import { fileURLToPath } from 'url';
import cookieParser from "cookie-parser";
import session from "express-session";
import passport from "passport";
import mongoose from 'mongoose';
// import { __filename, __dirname } from './currentPath.js';

// server port
const PORT = process.env.PORT || 8000;

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// create app
const app = express();

mongoose.connect('mongodb://localhost:27017/dotdot')
    .then(() => console.log('Connected to database'['bgCyan']))
    .catch(err => console.log(`Error: ${err}`)['bgRed']);

app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
app.use(cookieParser(process.env.COOKIE_SECRET)) // request.cookies
app.use(session({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: 60000 * 60, // 1 hour
    }
})) // request.session

// passport init
app.use(passport.initialize());
app.use(passport.session());

app.use(logger); // Logger middleware

// setup static folder ::to_review
app.use(express.static('public'));

// Routes
app.use('/api/v1.0', v1_0);

app.listen(PORT, () => console.log(`\nServer is running on port ${PORT}\n`['blue']));