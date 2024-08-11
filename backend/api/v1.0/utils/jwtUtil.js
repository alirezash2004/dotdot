import jsonwebtoken from "jsonwebtoken";
import fs from 'fs';
import path from 'path';
import { __dirname } from '../../../currentPath.js';

const pathToKey = path.join(__dirname, 'id_rsa_priv.pem');
const PRIV_KEY = fs.readFileSync(pathToKey, 'utf8');

const issueJWT = (userId) => {
    const expiresIn = '1d';

    const payload = {
        sub: userId,
        iat: Date.now()
    };

    const signedToken = jsonwebtoken.sign(payload, PRIV_KEY, { expiresIn: expiresIn, algorithm: 'RS256' })

    return {
        token: signedToken,
        expires: expiresIn
    }
}

const generateTokenAndSetCookie = (userId, res) => {
    const jwt = issueJWT(userId);

    res.cookie('jwt', jwt.token, {
        maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days in ms 
        httpOnly: true, // prevent xss attacks cross-site scripting attacks
        sameSite: 'strict' // csrf protection
    });
}

export default generateTokenAndSetCookie;