import Router from 'express';

import protectRoute from '../middleware/protectRoute.js';

import { singleImageUpload } from '../controllers/upload.controller.js';

const router = Router();

router.post('/upload/singleImage', protectRoute, singleImageUpload);

export default router;