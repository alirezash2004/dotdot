import { Router } from 'express';
import { getPageProfile, updatePageProfile } from '../controllers/pageProfileController.js';
import { checkSchema } from 'express-validator';
import { updateProfileSchema } from '../validators/pageProfile.schema.js';
import validationResultHandler from '../middleware/validationResultHandler.js';
import passport from 'passport';
import usernameSchema from '../validators/username.schema.js';
const router = Router();

router.get('/pageProfile/:username', passport.authenticate('jwt', { session: false }), checkSchema(usernameSchema, ['params']), validationResultHandler, getPageProfile);

router.post('/pageProfile', passport.authenticate('jwt', { session: false }), checkSchema(updateProfileSchema), validationResultHandler, updatePageProfile);

export default router;