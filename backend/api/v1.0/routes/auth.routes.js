import Router from 'express';
import { checkSchema } from 'express-validator';

import protectRoute from '../middleware/protectRoute.js';
import validationResultHandler from '../middleware/validationResultHandler.js';

import { getMe, login, logout, signup } from '../controllers/auth.controller.js';

import { newpageSchema } from '../validators/page.schema.js';
import { loginInputsSchema } from '../validators/auth.schema.js';

const router = Router();

router.get('/me', protectRoute, getMe);

router.post('/signup', checkSchema(newpageSchema), validationResultHandler, signup);

router.post('/login', checkSchema(loginInputsSchema), validationResultHandler, login);

router.post('/logout', logout);

export default router;