import express from "express";
import cookieParser from "cookie-parser";
import session from "express-session";
import connectToMongoDB from "./api/v1.0/db/connectToMongoDb.js";

import v1_0 from './api/v1.0/versionRouter.js';

import logger from "./api/v1.0/middleware/logger.js";

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
app.use(express.static('uploads'));

// Routes
app.use('/api/v1.0', v1_0);

app.listen(PORT, () => {
    connectToMongoDB();
    console.log(`\nServer is running on port ${PORT}\n`['blue'])
});