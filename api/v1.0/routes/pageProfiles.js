import { Router } from 'express';
import { deletePageProfile, getPageProfile, updatePageProfile } from '../controllers/pageProfileController.js';
const router = Router();

router.get('/pageProfile/:pageId', getPageProfile);

router.post('/pageProfile/:pageId', updatePageProfile);

router.delete('/pageProfile/:pageId', deletePageProfile);

export default router;