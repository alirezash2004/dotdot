import { Router } from 'express';
import { getpageSettings, updatepageSettings } from '../controllers/pageSettingsController.js';
import { checkSchema } from 'express-validator';
import { updatePageSettingSchema } from '../validators/schemas/pageSettingSchema.js';
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
}, ['params']), checkSchema(updatePageSettingSchema), updatepageSettings);

export default router;