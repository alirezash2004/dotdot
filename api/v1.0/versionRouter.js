import express from 'express';

import authRoutes from './routes/auth.routes.js';
import postsRoutes from './routes/posts.routes.js';
import pagesRoutes from './routes/pages.routes.js';
import followingRelationshipsRoutes from './routes/followingRelationships.routes.js';
import uploadPostMediaRoutes from './routes/uploadPostMedia.routes.js';
import notificationsRoutes from './routes/notifications.routes.js';

import notFound from './middleware/notFound.js';
import errorHandler from './middleware/errorHandler.js';

import { __filename, __dirname } from '../../currentPath.js';

const router = express.Router();

router.use('/auth', authRoutes);

router.use('/posts', postsRoutes);

router.use('/pages', pagesRoutes);

router.use('/followingRelationships', followingRelationshipsRoutes);

router.use('/postMedia', uploadPostMediaRoutes);

router.use('/notifications', notificationsRoutes);

// router.use(express.static(path.join(__dirname, 'public')));

// Error handler
router.use(notFound);
router.use(errorHandler);

export default router;