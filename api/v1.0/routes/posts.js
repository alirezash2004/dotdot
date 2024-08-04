// /api/v1.0/posts
import express from 'express';
import { deletePostByPostId, getPostByPostId, newPost } from '../controllers/postController.js';
import { checkSchema } from 'express-validator';
import postsSchema from '../validators/schemas/postsSchema.js';
import validationResultHandler from '../middleware/validationResultHandler.js';
import postIdSchema from '../validators/schemas/postIdSchema.js';
const router = express.Router();

// Get single post by postId
router.get('/posts/:postId', checkSchema(postIdSchema, ['params']), validationResultHandler, getPostByPostId);

router.post('/posts', checkSchema(postsSchema), validationResultHandler, newPost);

router.delete('/posts/:postId', checkSchema(postIdSchema, ['params']), validationResultHandler, deletePostByPostId);

export default router;