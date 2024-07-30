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
}, ['params']), checkSchema(pageSchema), updatePageinfo);

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