import jsonwebtoken from "jsonwebtoken";
import fs from 'fs';
import path from 'path';

import { __dirname } from '../../../currentPath.js';

import Page from "../models/page.model.js";

const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        if (!token) {
            const error = new Error('Unauthorized - No Token Provided');
            error.status = 401;
            return next(error);
        }

        const pathToKey = path.join(__dirname, 'id_rsa_pub.pem');
        const PUB_KEY = fs.readFileSync(pathToKey, 'utf8');

        const decoded = jsonwebtoken.verify(token, PUB_KEY, { algorithms: ['RS256'] });

        if (!decoded) {
            const error = new Error('Unauthorized - Invalid Token');
            error.status = 401;
            return next(error);
        }

        const user = await Page.findById(decoded.sub);
        if (!user) {
            const error = new Error('User Not Found');
            error.status = 404;
            return next(error);
        }

        req.user = user;

        next();
    } catch (err) {
        console.log(`Error in protectRoute : ${err}`);
        const error = new Error(`Internal Server Error`);
        error.status = 500;
        return next(error);
    }
}

export default protectRoute;