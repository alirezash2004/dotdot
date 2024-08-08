import { Router } from 'express';
import { getPage, updatePageinfo, deletePage } from '../controllers/page.controller.js';
import { checkSchema } from 'express-validator';
import validationResultHandler from '../middleware/validationResultHandler.js';
import pageUpdateSchema from '../validators/pageUpdate.schema.js';
import usernameSchema from '../validators/username.schema.js';
import protectRoute from '../middleware/protectRoute.js';
const router = Router();

router.get('/pages/:username', protectRoute, checkSchema(usernameSchema, ['params']), validationResultHandler, getPage);

router.put('/pages/:username', protectRoute, checkSchema(usernameSchema, ['params']), checkSchema(pageUpdateSchema), validationResultHandler, updatePageinfo);

router.delete('/pages', protectRoute, deletePage);

export default router;