import { Router } from 'express';
import { deletepageSettings, getpageSettings, updatepageSettings } from '../controllers/pageSettingsController.js';
const router = Router();

router.get('/pageSettings/:pageId', getpageSettings);

router.post('/pageSettings/:pageId', updatepageSettings);

router.delete('/pageSettings/:pageId', deletepageSettings);

export default router;