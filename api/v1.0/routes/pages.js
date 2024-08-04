import { Router } from 'express';
import { getPage, newPage, updatePageinfo, deletePage } from '../controllers/pageController.js';
import { checkSchema } from 'express-validator';
import pageSchema from '../validators/schemas/pageSchema.js';
import validationResultHandler from '../middleware/validationResultHandler.js';
import pageIdSchema from '../validators/schemas/pageIdSchema.js';
import pageUpdateSchema from '../validators/schemas/pageUpdateSchema.js';
const router = Router();

router.get('/pages/:pageId', checkSchema(pageIdSchema, ['params']), validationResultHandler, getPage);

router.post('/pages', checkSchema(pageSchema), validationResultHandler, newPage);

router.put('/pages/:pageId', checkSchema(pageIdSchema, ['params']), checkSchema(pageUpdateSchema), validationResultHandler, updatePageinfo);

router.delete('/pages/:pageId', checkSchema(pageIdSchema, ['params']), validationResultHandler, deletePage);


export default router;