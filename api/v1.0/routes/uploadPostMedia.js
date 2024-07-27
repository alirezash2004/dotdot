import Router from 'express';
import { singleImageUpload } from '../controllers/uploadController.js';
const router = Router();

router.post('/postMedia/uploadPostMedia/singleImage', singleImageUpload);

export default router;