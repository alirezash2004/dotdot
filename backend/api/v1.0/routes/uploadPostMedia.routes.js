import Router from 'express';

import protectRoute from '../middleware/protectRoute.js';

import { profilePicUpload, singleImageUpload } from '../controllers/upload.controller.js';

const router = Router();

router.post('/upload/singleImage', protectRoute, singleImageUpload);

// TODO: move it to another route file or fix naming
router.post('/upload/profilePic', protectRoute, profilePicUpload);

export default router;