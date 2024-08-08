import Router from 'express';
import { singleImageUpload } from '../controllers/upload.controller.js';
import passport from 'passport';

const router = Router();

router.post('/postMedia/uploadPostMedia/singleImage', passport.authenticate('jwt', { session: false }), singleImageUpload);

export default router;