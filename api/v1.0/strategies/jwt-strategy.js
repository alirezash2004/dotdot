import passport from "passport";
import { Strategy, ExtractJwt } from 'passport-jwt';
import fs from 'fs';
import path from 'path';
import { __dirname } from '../../../currentPath.js';
import Page from "../models/page.model.js";

const pathToKey = path.join(__dirname, 'id_rsa_pub.pem');
const PUB_KEY = fs.readFileSync(pathToKey, 'utf8');


const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: PUB_KEY,
    algorithms: ['RS256']
}

const strategy = new Strategy(opts, async (payload, done) => {
    try {
        const findPage = await Page.findById(payload.sub).exec()
        if (!findPage) throw new Error('Token is not valid!');
        // TODO: handle token expiration
        done(null, findPage);
    } catch (err) {
        done(err, null);
    }
});

passport.use(strategy);