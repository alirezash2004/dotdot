// /api/v1.0/posts
import express from 'express';
import { checkSchema } from 'express-validator';

import protectRoute from '../middleware/protectRoute.js';
import validationResultHandler from '../middleware/validationResultHandler.js';

import { commentOnPost, deletePostByPostId, getExplorePosts, getLikedPosts, getPagePosts, getPostByPostId, getRecentPosts, getSavedPosts, likeUnlikePost, newPost, saveUnsavePost } from '../controllers/post.controller.js';

import { skipQuerySchema, usernameSchema } from '../validators/global.schema.js';
import { postCommentSchema, postIdSchema, postsSchema } from '../validators/post.schema.js';

const router = express.Router();

router.get('/recent', checkSchema(skipQuerySchema, ['query']), validationResultHandler, protectRoute, getRecentPosts);

router.get('/explore', checkSchema(skipQuerySchema, ['query']), validationResultHandler, protectRoute, getExplorePosts);

router.get('/likes', checkSchema(skipQuerySchema, ['query']), validationResultHandler, protectRoute, getLikedPosts);

router.get('/saved', protectRoute, checkSchema(skipQuerySchema, ['query']), validationResultHandler, getSavedPosts);

router.get('/page/:username', protectRoute, checkSchema(skipQuerySchema, ['query']), checkSchema(usernameSchema), validationResultHandler, getPagePosts);

// Get single post by postId
router.get('/:postId', protectRoute, checkSchema(postIdSchema, ['params']), validationResultHandler, getPostByPostId);

// TODO: add a dynnamic route for fetching posts media 

router.post('/create', protectRoute, checkSchema(postsSchema), validationResultHandler, newPost);

router.post('/like/:postId', protectRoute, checkSchema(postIdSchema, ['params']), validationResultHandler, likeUnlikePost);

router.post('/comment/:postId', protectRoute, checkSchema(postIdSchema, ['params']), checkSchema(postCommentSchema), validationResultHandler, commentOnPost);

router.post('/save/:postId', protectRoute, checkSchema(postIdSchema, ['params']), validationResultHandler, saveUnsavePost);

router.delete('/:postId', protectRoute, checkSchema(postIdSchema, ['params']), validationResultHandler, deletePostByPostId);

export default router;