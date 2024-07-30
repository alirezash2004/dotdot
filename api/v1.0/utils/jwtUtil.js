import jsonwebtoken from "jsonwebtoken";
import fs from 'fs';
import path from 'path';
import { __dirname } from '../../../currentPath.js';

const pathToKey = path.join(__dirname, 'id_rsa_priv.pem');
const PRIV_KEY = fs.readFileSync(pathToKey, 'utf8');

export const issueJWT = (user) => {
    const id = user.id;

    const expiresIn = '1d';

    const payload = {
        sub: id,
        iat: Date.now()
    };

    console.log(payload.iat);

    const signedToken = jsonwebtoken.sign(payload, PRIV_KEY, { expiresIn: expiresIn, algorithm: 'RS256' })

    return {
        token: "Bearer " + signedToken,
        expires: expiresIn
    }
}