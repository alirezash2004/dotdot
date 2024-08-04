// /api/v1.0/posts
import express from 'express';
import { deletePostByPostId, getPostByPostId, newPost } from '../controllers/postController.js';
import { checkSchema } from 'express-validator';
import postsSchema from '../validators/schemas/postsSchema.js';
import validationResultHandler from '../middleware/validationResultHandler.js';
import pageIdSchema from '../validators/schemas/pageIdSchema.js';
const router = express.Router();

// Get single post by postId
router.get('/posts/:postId', checkSchema(pageIdSchema, ['params']), validationResultHandler, getPostByPostId);

router.post('/posts', checkSchema(postsSchema), validationResultHandler, newPost);

router.delete('/posts/:postId', checkSchema(pageIdSchema, ['params']), validationResultHandler, deletePostByPostId);

export default router;