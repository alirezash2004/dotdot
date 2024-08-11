import { Router } from 'express';
import { checkSchema } from 'express-validator';

import protectRoute from '../middleware/protectRoute.js';
import validationResultHandler from '../middleware/validationResultHandler.js';

import { getPage, updatePageinfo, deletePage } from '../controllers/page.controller.js';

import { usernameSchema } from '../validators/global.schema.js';
import { pageUpdateSchema } from '../validators/page.schema.js';

const router = Router();

router.get('/:username', protectRoute, checkSchema(usernameSchema, ['params']), validationResultHandler, getPage);

router.put('/update', protectRoute, checkSchema(pageUpdateSchema), validationResultHandler, updatePageinfo);

router.delete('/', protectRoute, deletePage);

export default router;