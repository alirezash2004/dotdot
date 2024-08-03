import { Router } from 'express';
import { deletePageProfile, getPageProfile, updatePageProfile } from '../controllers/pageProfileController.js';
import { checkSchema } from 'express-validator';
import { updateProfileSchema } from '../validators/schemas/pageProfileSchema.js';
const router = Router();

router.get('/pageProfile/:pageId', checkSchema({
    pageId: {
        exists: {
            errorMessage: 'pageId is required'
        },
        isEmpty: { negated: true },
        trim: true
    }
}, ['params']), getPageProfile);

router.post('/pageProfile/:pageId', checkSchema({
    pageId: {
        exists: {
            errorMessage: 'pageId is required'
        },
        isEmpty: { negated: true },
        trim: true
    }
}, ['params']), checkSchema(updateProfileSchema), updatePageProfile);

router.delete('/pageProfile/:pageId', checkSchema({
    pageId: {
        exists: {
            errorMessage: 'pageId is required'
        },
        isEmpty: { negated: true },
        trim: true
    }
}, ['params']), deletePageProfile);

export default router;