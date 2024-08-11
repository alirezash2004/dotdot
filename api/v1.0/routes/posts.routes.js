// /api/v1.0/posts
import express from 'express';
import { checkSchema } from 'express-validator';

import protectRoute from '../middleware/protectRoute.js';
import validationResultHandler from '../middleware/validationResultHandler.js';

import { commentOnPost, deletePostByPostId, getLikedPosts, getPagePosts, getPostByPostId, getRecentPosts, likeUnlikePost, newPost } from '../controllers/post.controller.js';

import { skipQuerySchema, usernameSchema } from '../validators/global.schema.js';
import { postCommentSchema, postIdSchema, postsSchema } from '../validators/post.schema.js';

const router = express.Router();

router.get('/recent', checkSchema(skipQuerySchema, ['query']), validationResultHandler, protectRoute, getRecentPosts);

router.get('/likes', protectRoute, getLikedPosts);

router.get('/page/:username', protectRoute, checkSchema(skipQuerySchema, ['query']), checkSchema(usernameSchema), validationResultHandler, getPagePosts);

// Get single post by postId
router.get('/:postId', protectRoute, checkSchema(postIdSchema, ['params']), validationResultHandler, getPostByPostId);

router.post('/create', protectRoute, checkSchema(postsSchema), validationResultHandler, newPost);

router.post('/like/:postId', protectRoute, checkSchema(postIdSchema, ['params']), validationResultHandler, likeUnlikePost);

router.post('/comment/:postId', protectRoute, checkSchema(postIdSchema, ['params']), checkSchema(postCommentSchema), validationResultHandler, commentOnPost);

router.delete('/:postId', protectRoute, checkSchema(postIdSchema, ['params']), validationResultHandler, deletePostByPostId);

export default router;