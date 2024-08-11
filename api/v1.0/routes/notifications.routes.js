import Router from 'express';
import { checkSchema } from 'express-validator';

import validationResultHandler from '../middleware/validationResultHandler.js';
import protectRoute from '../middleware/protectRoute.js';

import { deleteNotification, deleteNotifications, getNotifications } from '../controllers/notifications.contoller.js';

import { notificationIdSchema } from '../validators/notification.schema.js';

const router = Router();

router.get('/', protectRoute, getNotifications);

router.delete('/', protectRoute, deleteNotifications);

router.delete('/:notificationId', checkSchema(notificationIdSchema), validationResultHandler, protectRoute, deleteNotification);

export default router;