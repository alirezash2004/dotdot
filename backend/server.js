import express from "express";
import path from 'path';
import cookieParser from "cookie-parser";
import session from "express-session";
// import connectToMongoDB from "./api/v1.0/db/connectToMongoDb.js";
import { configDotenv } from "dotenv";
import mongoose from "mongoose";
configDotenv();

const connectToMongoDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_CONNECT_URI);
        console.log('Connected to database'['bgCyan']);
    } catch (error) {
        console.log(`Error: ${error}`['bgRed'])
    }
}

import v1_0 from './api/versionRouter.js';

import logger from "./api/v1.0/middleware/logger.js";
import customHeaders from "./api/v1.0/middleware/customHeaders.js";
import { app, server } from "./socket/socket.js";

const __dirname = path.resolve();

// server port
const PORT = process.env.PORT || 8000;



app.disable('x-powered-by');
app.use(customHeaders);

app.use(express.json({ limit: '14mb' })) // for parsing application/json
app.use(express.urlencoded({ extended: true, limit: '14mb' })) // for parsing application/x-www-form-urlencoded
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

// fake delay - TODO: remove later
app.use(function (req, res, next) { setTimeout(next, 1000) });

// setup static folder
app.use(express.static(path.join(__dirname, 'backend', 'uploads'), {
    extensions: ['webp'],
    dotfiles: 'ignore',
    immutable: true,
    maxAge: '1h'
}));

// Routes
app.use('/api/v1.0', v1_0);

// if the request is not api then load frontend(react)
if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, '/frontend/dist')));

    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
    })
}

server.listen(PORT, () => {
    connectToMongoDB();
    console.log(`\nServer is running on port ${PORT}\n`['blue'])
});