// /api/v1.0/posts
import express from 'express';
import { deletePostByPostId, getPostByPostId, newPost } from '../controllers/postController.js';
import { checkSchema } from 'express-validator';
import postsSchema from '../validators/posts.schema.js';
import validationResultHandler from '../middleware/validationResultHandler.js';
import postIdSchema from '../validators/postId.schema.js';
import passport from 'passport';
const router = express.Router();

// Get single post by postId
router.get('/posts/:postId', passport.authenticate('jwt', { session: false }), checkSchema(postIdSchema, ['params']), validationResultHandler, getPostByPostId);

router.post('/posts', passport.authenticate('jwt', { session: false }), checkSchema(postsSchema), validationResultHandler, newPost);

router.delete('/posts/:postId', passport.authenticate('jwt', { session: false }), checkSchema(postIdSchema, ['params']), validationResultHandler, deletePostByPostId);

export default router;