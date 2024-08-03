import { Router } from 'express';
import { getpageSettings, updatepageSettings } from '../controllers/pageSettingsController.js';
import { checkSchema } from 'express-validator';
import { updatePageSettingSchema } from '../validators/schemas/pageSettingSchema.js';
import validationResultHandler from '../middleware/validationResultHandler.js';
import pageIdSchema from '../validators/schemas/pageIdSchema.js';
const router = Router();

router.get('/pageSettings/:pageId', checkSchema(pageIdSchema, ['params']), validationResultHandler, getpageSettings);

router.post('/pageSettings/:pageId', checkSchema(pageIdSchema, ['params']), checkSchema(updatePageSettingSchema), validationResultHandler, updatepageSettings);

export default router;