import passport from "passport";
import { Strategy } from "passport-local";
import { samplePages } from "../helpers/mockuser.js";
import { validatePassword } from "../utils/passwordsUtil.js";

passport.serializeUser((user, done) => {
    // console.log('serializeUser');
    done(null, user.id);
})

passport.deserializeUser((id, done) => {
    // console.log('deserializeUser');
    // console.log(id);
    try {
        const findPage = samplePages.find(page => page.id === id);
        if (!findPage) throw new Error('Page not found');
        done(null, findPage);
    } catch (err) {
        done(err, null);
    }
})

passport.use(
    new Strategy((username, password, done) => {
        // console.log(`Username: ${username}`);
        // console.log(`Password: ${password}`);
        try {
            const findPage = samplePages.find(page => page.username === username);
            if (!findPage) throw new Error('Page not found');
            if (!validatePassword(password, findPage.password, findPage.salt)) throw new Error('invalid credentials');
            done(null, findPage);
        } catch (err) {
            done(err, null);
        }
    })
)