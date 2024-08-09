import { Router } from 'express';
import { checkSchema } from 'express-validator';

import protectRoute from '../middleware/protectRoute.js';
import validationResultHandler from '../middleware/validationResultHandler.js';

import { getpageSettings, updatepageSettings } from '../controllers/pageSettings.controller.js';

import updatePageSettingSchema from '../validators/pageSetting.schema.js';

const router = Router();

router.get('/', protectRoute, getpageSettings);

router.post('/', protectRoute, checkSchema(updatePageSettingSchema), validationResultHandler, updatepageSettings);

export default router;