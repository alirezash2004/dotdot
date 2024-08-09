import { Router } from 'express';
import { getPageProfile, updatePageProfile } from '../controllers/pageProfile.controller.js';
import { checkSchema } from 'express-validator';
import { updateProfileSchema } from '../validators/pageProfile.schema.js';
import validationResultHandler from '../middleware/validationResultHandler.js';
import usernameSchema from '../validators/username.schema.js';
import protectRoute from '../middleware/protectRoute.js';
const router = Router();

router.get('/:username', protectRoute, checkSchema(usernameSchema, ['params']), validationResultHandler, getPageProfile);

router.post('/', protectRoute, checkSchema(updateProfileSchema), validationResultHandler, updatePageProfile);

export default router;