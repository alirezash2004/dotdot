// /api/v1.0/posts
import express from 'express';
import { checkSchema } from 'express-validator';

import protectRoute from '../middleware/protectRoute.js';
import validationResultHandler from '../middleware/validationResultHandler.js';

import { deletePostByPostId, getPostByPostId, newPost } from '../controllers/post.controller.js';

import postsSchema from '../validators/posts.schema.js';
import postIdSchema from '../validators/postId.schema.js';

const router = express.Router();

// Get single post by postId
router.get('/:postId', protectRoute, checkSchema(postIdSchema, ['params']), validationResultHandler, getPostByPostId);

router.post('/', protectRoute, checkSchema(postsSchema), validationResultHandler, newPost);

router.delete('/:postId', protectRoute, checkSchema(postIdSchema, ['params']), validationResultHandler, deletePostByPostId);

export default router;