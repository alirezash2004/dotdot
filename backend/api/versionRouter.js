import express from 'express';

import authRoutes from './v1.0/routes/auth.routes.js';
import postsRoutes from './v1.0/routes/posts.routes.js';
import pagesRoutes from './v1.0/routes/pages.routes.js';
import followingRelationshipsRoutes from './v1.0/routes/followingRelationships.routes.js';
import uploadPostMediaRoutes from './v1.0/routes/uploadPostMedia.routes.js';
import notificationsRoutes from './v1.0/routes/notifications.routes.js';

import notFound from './v1.0/middleware/notFound.js';
import errorHandler from './v1.0/middleware/errorHandler.js';

import { __filename, __dirname } from '../currentPath.js';

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