import express from 'express';
import auth from './routes/auth.routes.js';
import posts from './routes/posts.routes.js';
import pageProfiles from './routes/pageProfiles.routes.js';
import pageSettings from './routes/pageSettings.routes.js';
import pagesRouter from './routes/pages.routes.js';
import followingRelationships from './routes/followingRelationships.routes.js';
import uploadPostMedia from './routes/uploadPostMedia.routes.js';
import notFound from './middleware/notFound.js';
import errorHandler from './middleware/errorHandler.js';
import { __filename, __dirname } from '../../currentPath.js';

const router = express.Router();

router.use(auth);

router.use(posts);

router.use(pageProfiles);

router.use(pageSettings);

router.use(pagesRouter);

router.use(followingRelationships);

router.use(uploadPostMedia);

// router.use(express.static(path.join(__dirname, 'public')));

// Error handler
router.use(notFound);
router.use(errorHandler);

export default router;