import Router from 'express';
import { checkSchema } from 'express-validator';

import validationResultHandler from '../middleware/validationResultHandler.js';

import { login, logout, signup } from '../controllers/auth.controller.js';

import { pageSchema } from '../validators/page.schema.js';
import { loginInputsSchema } from '../validators/auth.schema.js';

const router = Router();

router.post('/signup', checkSchema(pageSchema), validationResultHandler, signup);

router.post('/login', checkSchema(loginInputsSchema), validationResultHandler, login);

router.post('/logout', logout);

export default router;