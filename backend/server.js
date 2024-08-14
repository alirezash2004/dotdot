import express from "express";
import path from 'path';
import cookieParser from "cookie-parser";
import session from "express-session";
import connectToMongoDB from "./api/v1.0/db/connectToMongoDb.js";
import { configDotenv } from "dotenv";
configDotenv();

import v1_0 from './api/versionRouter.js';

import logger from "./api/v1.0/middleware/logger.js";

const __dirname = path.resolve();

// server port
const PORT = process.env.PORT || 8000;

// create app
const app = express();

app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
app.use(cookieParser(process.env.COOKIE_SECRET)) // request.cookies
app.use(session({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: 60000 * 60, // 1 hour
        httpOnly: true,
        sameSite: 'strict'
    }
})) // request.session

app.use(logger); // Logger middleware

// setup static folder ::to_review
app.use(express.static('public'));
app.use(express.static(path.join(__dirname, 'backend', 'uploads')));

// Routes
app.use('/api/v1.0', v1_0);

// TODO: uncomment for production ---- if the request is not api then load frontend(react)
// if (process.env.NODE_ENV === "production") {
//     app.use(express.static(path.join(__dirname, '/frontend/dist')));

//     app.get("*", (res, res) => {
//         res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
//     })
// }

app.listen(PORT, () => {
    connectToMongoDB();
    console.log(`\nServer is running on port ${PORT}\n`['blue'])
});