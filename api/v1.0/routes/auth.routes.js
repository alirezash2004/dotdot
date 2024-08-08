import Router from 'express';
import { checkSchema } from 'express-validator';
import validationResultHandler from '../middleware/validationResultHandler.js';
import { login, logout, signup } from '../controllers/auth.controller.js';
import pageSchema from '../validators/page.schema.js';
import loginInputsSchema from '../validators/loginInputs.schema.js';
const router = Router();

router.post('/auth/signup', checkSchema(pageSchema), validationResultHandler, signup);

router.post('/auth/login', checkSchema(loginInputsSchema), validationResultHandler, login);

router.post('/auth/logout', logout);

export default router;