import passport from "passport";
import { Strategy, ExtractJwt } from 'passport-jwt';
import { samplePages } from "../helpers/mockuser.js";
import fs from 'fs';
import path from 'path';
import { __dirname } from '../../../currentPath.js';

const pathToKey = path.join(__dirname, 'id_rsa_pub.pem');
const PUB_KEY = fs.readFileSync(pathToKey, 'utf8');


const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: PUB_KEY,
    algorithms: ['RS256']
}

const strategy = new Strategy(opts, (payload, done) => {
    try {
        const findPage = samplePages.find(page => page.id === payload.sub);
        if (!findPage) throw new Error('Page not found');
        // TODO: handle token expiration
        done(null, findPage);
    } catch (err) {
        done(err, null);
    }
});

passport.use(strategy);