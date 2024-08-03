import { Router } from 'express';
import { getPageProfile, updatePageProfile } from '../controllers/pageProfileController.js';
import { checkSchema } from 'express-validator';
import { updateProfileSchema } from '../validators/schemas/pageProfileSchema.js';
import validationResultHandler from '../middleware/validationResultHandler.js';
import pageIdSchema from '../validators/schemas/pageIdSchema.js';
const router = Router();

router.get('/pageProfile/:pageId', checkSchema(pageIdSchema, ['params']), validationResultHandler, getPageProfile);

router.post('/pageProfile/:pageId', checkSchema(pageIdSchema, ['params']), checkSchema(updateProfileSchema), validationResultHandler, updatePageProfile);

export default router;