// /api/v1.0/posts
import express from 'express';
import { deletePostByPostId, getPostByPostId, newPost } from '../controllers/post.controller.js';
import { checkSchema } from 'express-validator';
import postsSchema from '../validators/posts.schema.js';
import validationResultHandler from '../middleware/validationResultHandler.js';
import postIdSchema from '../validators/postId.schema.js';
import protectRoute from '../middleware/protectRoute.js';
const router = express.Router();

// Get single post by postId
router.get('/posts/:postId', protectRoute, checkSchema(postIdSchema, ['params']), validationResultHandler, getPostByPostId);

router.post('/posts', protectRoute, checkSchema(postsSchema), validationResultHandler, newPost);

router.delete('/posts/:postId', protectRoute, checkSchema(postIdSchema, ['params']), validationResultHandler, deletePostByPostId);

export default router;