import { Router } from 'express';
import { checkSchema } from 'express-validator';

import protectRoute from '../middleware/protectRoute.js';
import validationResultHandler from '../middleware/validationResultHandler.js';

import { getPageProfile, updatePageProfile } from '../controllers/pageProfile.controller.js';

import updateProfileSchema from '../validators/pageProfile.schema.js';
import usernameSchema from '../validators/username.schema.js';

const router = Router();

router.get('/:username', protectRoute, checkSchema(usernameSchema, ['params']), validationResultHandler, getPageProfile);

router.post('/', protectRoute, checkSchema(updateProfileSchema), validationResultHandler, updatePageProfile);

export default router;