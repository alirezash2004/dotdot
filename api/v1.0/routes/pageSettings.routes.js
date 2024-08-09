import { Router } from 'express';
import { getpageSettings, updatepageSettings } from '../controllers/pageSettings.controller.js';
import { checkSchema } from 'express-validator';
import { updatePageSettingSchema } from '../validators/pageSetting.schema.js';
import validationResultHandler from '../middleware/validationResultHandler.js';
import protectRoute from '../middleware/protectRoute.js';
const router = Router();

router.get('/', protectRoute, getpageSettings);

router.post('/', protectRoute, checkSchema(updatePageSettingSchema), validationResultHandler, updatepageSettings);

export default router;