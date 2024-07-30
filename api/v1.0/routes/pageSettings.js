import { Router } from 'express';
import { deletepageSettings, getpageSettings, updatepageSettings } from '../controllers/pageSettingsController.js';
import { checkSchema } from 'express-validator';
const router = Router();

router.get('/pageSettings/:pageId', checkSchema({
    pageId: {
        exists: {
            errorMessage: 'pageId is required'
        },
        isEmpty: { negated: true },
        trim: true
    }
}, ['params']), getpageSettings);

router.post('/pageSettings/:pageId', checkSchema({
    pageId: {
        exists: {
            errorMessage: 'pageId is required'
        },
        isEmpty: { negated: true },
        trim: true
    }
}, ['params']), updatepageSettings);

router.delete('/pageSettings/:pageId', checkSchema({
    pageId: {
        exists: {
            errorMessage: 'pageId is required'
        },
        isEmpty: { negated: true },
        trim: true
    }
}, ['params']), deletepageSettings);

export default router;