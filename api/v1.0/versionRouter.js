import express from 'express';
import posts from './routes/posts.js';
import pageProfiles from './routes/pageProfiles.js';
import pageSettings from './routes/pageSettings.js';
import pagesRouter from './routes/pages.js';
import followingRelationships from './routes/followingRelationships.js';
import uploadPostMedia from './routes/uploadPostMedia.js';
import notFound from './middleware/notFound.js';
import errorHandler from './middleware/errorHandler.js';
import { __filename, __dirname } from '../../currentPath.js';

const router = express.Router();

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