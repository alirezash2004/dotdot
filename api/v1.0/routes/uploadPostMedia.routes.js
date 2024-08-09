import Router from 'express';
import { singleImageUpload } from '../controllers/upload.controller.js';
import protectRoute from '../middleware/protectRoute.js';

const router = Router();

router.post('/upload/singleImage', protectRoute, singleImageUpload);

export default router;