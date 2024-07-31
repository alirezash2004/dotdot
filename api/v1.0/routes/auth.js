import Router from 'express';
import passport from "passport";
import '../strategies/local-strategy.js';
import '../strategies/jwt-strategy.js';
import { checkSchema, matchedData, validationResult } from 'express-validator';
import { samplePages } from '../helpers/mockuser.js';
import { issueJWT } from '../utils/jwtUtil.js';
import { validatePassword } from '../utils/passwordsUtil.js';
const router = Router();

router.post('/auth/local',
    passport.authenticate('local'),
    (req, res) => {
        // console.log(req.user);
        res.status(200).json({ done: true });
    }
)

router.get('/auth/local/status',
    (req, res) => {
        console.log(req.session);
        console.log(req.user);
        return req.user ? res.send(req.user) : res.sendStatus(401);
    }
)

router.post('/auth/jwt/',
    checkSchema({
        username: {
            exists: {
                errorMessage: 'Username is required'
            },
            matches: {
                errorMessage: 'Username must be 6-10 characters and can only contains . and _ Username can\'t start with .',
                options: /^(?![0-9.])(?=[a-zA-Z0-9._]{6,16}$)[a-zA-Z][a-zA-Z0-9_.]*[^.]$/
            },
            trim: true,
            escape: true,
        },
        password: {
            exists: {
                errorMessage: 'Password is required'
            },
            trim: true,
            escape: true,
        },
    }),
    (req, res, next) => {
        const result = validationResult(req).array({ onlyFirstError: true });
        if (result.length !== 0) {
            return res.status(400).send({ success: false, msg: result[0].msg })
        }

        const data = matchedData(req);

        const { username, password } = data;

        const findPage = samplePages.find(page => page.username === username);
        if (!findPage) {
            const error = new Error('Page not found');
            error.status = 500;
            return next(error);
        }

        if (!validatePassword(password, findPage.password, findPage.salt)) {
            const error = new Error('invalid credentials');
            error.status = 500;
            return next(error);
        }

        const jwt = issueJWT(findPage);

        res.json({ success: true, token: jwt.token, expiresIn: jwt.expires })
    }
)

router.get('/auth/jwt/status',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
        res.json({ success: true, msg: 'Authenticated' })
    }
)

router.get('/auth/combined/status',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
        console.log(req.session);
        console.log(req.user);
        return req.session.passport ? res.send(req.user) : res.sendStatus(401);
    }
)


export default router;