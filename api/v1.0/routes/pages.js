import { Router } from 'express';
import { getPage, newPage, updatePageinfo, deletePage } from '../controllers/pageController.js';
import { checkSchema } from 'express-validator';
import pageSchema from '../validators/schemas/pageSchema.js';
import validationResultHandler from '../middleware/validationResultHandler.js';
import pageUpdateSchema from '../validators/schemas/pageUpdateSchema.js';
import passport from 'passport';
import usernameSchema from '../validators/schemas/usernameSchema.js';
const router = Router();

router.get('/pages/:username', passport.authenticate('jwt', { session: false }), checkSchema(usernameSchema, ['params']), validationResultHandler, getPage);

router.post('/pages', checkSchema(pageSchema), validationResultHandler, newPage);

router.put('/pages/:username', passport.authenticate('jwt', { session: false }), checkSchema(usernameSchema, ['params']), checkSchema(pageUpdateSchema), validationResultHandler, updatePageinfo);

router.delete('/pages', passport.authenticate('jwt', { session: false }), deletePage);

export default router;