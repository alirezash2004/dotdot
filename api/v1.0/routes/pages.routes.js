import { Router } from 'express';
import { getPage, newPage, updatePageinfo, deletePage } from '../controllers/page.controller.js';
import { checkSchema } from 'express-validator';
import pageSchema from '../validators/page.schema.js';
import validationResultHandler from '../middleware/validationResultHandler.js';
import pageUpdateSchema from '../validators/pageUpdate.schema.js';
import passport from 'passport';
import usernameSchema from '../validators/username.schema.js';
const router = Router();

router.get('/pages/:username', passport.authenticate('jwt', { session: false }), checkSchema(usernameSchema, ['params']), validationResultHandler, getPage);

router.post('/pages', checkSchema(pageSchema), validationResultHandler, newPage);

router.put('/pages/:username', passport.authenticate('jwt', { session: false }), checkSchema(usernameSchema, ['params']), checkSchema(pageUpdateSchema), validationResultHandler, updatePageinfo);

router.delete('/pages', passport.authenticate('jwt', { session: false }), deletePage);

export default router;