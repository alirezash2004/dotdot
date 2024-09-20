import Router from 'express';
import { checkSchema } from 'express-validator';

import validationResultHandler from '../middleware/validationResultHandler.js';
import protectRoute from '../middleware/protectRoute.js';

import { getMessages, getPagesForSidebar, sendMessage, setReadMessages } from '../controllers/message.controller.js';

import { newMessageSchema } from '../validators/message.schema.js';
import { pageIdSchema } from '../validators/global.schema.js';

const router = Router();

// get pages for sidebar
router.get('/sbp', protectRoute, getPagesForSidebar);

router.get("/:pageId", protectRoute, checkSchema(pageIdSchema), validationResultHandler, getMessages);

router.post("/send/:pageId", protectRoute, checkSchema(pageIdSchema), checkSchema(newMessageSchema), validationResultHandler, sendMessage);

// set read messages
router.post("/sr/:pageId", protectRoute, checkSchema(pageIdSchema), validationResultHandler, setReadMessages);

export default router;