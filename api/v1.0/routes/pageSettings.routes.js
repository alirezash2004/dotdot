import { Router } from 'express';
import { getpageSettings, updatepageSettings } from '../controllers/pageSettings.controller.js';
import { checkSchema } from 'express-validator';
import { updatePageSettingSchema } from '../validators/pageSetting.schema.js';
import validationResultHandler from '../middleware/validationResultHandler.js';
import passport from 'passport';
const router = Router();

router.get('/pageSettings', passport.authenticate('jwt', { session: false }), getpageSettings);

router.post('/pageSettings', passport.authenticate('jwt', { session: false }), checkSchema(updatePageSettingSchema), validationResultHandler, updatepageSettings);

export default router;