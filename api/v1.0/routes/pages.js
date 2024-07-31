import { Router } from 'express';
import { getPage, newPage, updatePageinfo, deletePage } from '../controllers/pageController.js';
import { checkSchema } from 'express-validator';
import pageSchema from '../validators/schemas/pageSchema.js';
const router = Router();

router.get('/pages/getPage/:pageId', checkSchema({
    pageId: {
        exists: {
            errorMessage: 'pageId is required'
        },
        isEmpty: { negated: true },
        trim: true
    }
}, ['params']), getPage);

router.post('/pages/newPage', checkSchema(pageSchema), newPage);

router.put('/pages/updatePageinfo/:pageId', checkSchema({
    pageId: {
        exists: {
            errorMessage: 'pageId is required'
        },
        isEmpty: { negated: true },
        trim: true
    }
}, ['params']), checkSchema({
    username: {
        matches: {
            errorMessage: 'Username must be 6-10 characters and can only contains . and _ Username can\'t start with .',
            options: /^(?![0-9.])(?=[a-zA-Z0-9._]{6,16}$)[a-zA-Z][a-zA-Z0-9_.]*[^.]$/
        },
        trim: true,
        escape: true,
    },
    password: {
        isStrongPassword: {
            errorMessage: 'Password must be at least 8 characters & contain at least one Upperacase letter, one number and one symbol',
            options: {
                minLength: 8,
                minLowercase: 0,
                minUppercase: 1,
                minNumbers: 1,
                minSymbols: 1,
            }
        },
        trim: true,
        escape: true,
    },
    fullname: {
        errorMessage: 'Fullname can only contain alphabet characters & must be 6-20 characters & can have 2 spaces in total',
        matches: { options: /^(?=.{6,20}$)[A-Za-z]+(?: [A-Za-z]+){0,2}$/ },
        trim: true,
        escape: true,
    },
    email: {
        isEmail: {
            errorMessage: 'only gmail is accepted',
            options: { host_whitelist: ['gmail.com'] }
        },
        normalizeEmail: {
            options: {
                all_lowercase: true,
                gmail_remove_dots: true,

            }
        },
        trim: true,
        escape: true,
    },
    pagetype: {
        errorMessage: 'pagetype can only be private or public',
        matches: { options: /\b(private|public)\b/ }
    }
}), updatePageinfo);

router.delete('/pages/delPage/:pageId', checkSchema({
    pageId: {
        exists: {
            errorMessage: 'pageId is required'
        },
        isEmpty: { negated: true },
        trim: true
    }
}, ['params']), deletePage);


export default router;