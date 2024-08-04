import passport from "passport";
import { Strategy } from "passport-local";
import { samplePages } from "../helpers/mockuser.js";
import { validatePassword } from "../utils/passwordsUtil.js";
import { Page } from "../mongoose/schemas/page.js";

passport.serializeUser((user, done) => {
    // console.log('serializeUser');
    done(null, user.id);
})

passport.deserializeUser(async (id, done) => {
    // console.log('deserializeUser');
    // console.log(id);
    try {
        console.log(id);
        const findPage = await Page.findOne({ _id: id }).select('password salt').exec()
        if (!findPage) throw new Error('Page not found');
        done(null, findPage);
    } catch (err) {
        done(err, null);
    }
})

passport.use(
    new Strategy(async (username, password, done) => {
        // console.log(`Username: ${username}`);
        // console.log(`Password: ${password}`);
        try {
            const findPage = await Page.findOne({ username }).select('password salt').exec()
            if (!findPage) throw new Error('Page not found');
            if (!validatePassword(password, findPage.password, findPage.salt)) throw new Error('invalid credentials');
            done(null, findPage);
        } catch (err) {
            done(err, null);
        }
    })
)