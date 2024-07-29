// /api/v1.0/posts
import express from 'express';
import { deletePostByPostId, getPostByPostId, newPost } from '../controllers/postController.js';
const router = express.Router();

// Get single post by postId
router.get('/posts/:postId', getPostByPostId);

router.post('/posts/newPost', newPost);

router.delete('/posts/delPost/:postId', deletePostByPostId);

export default router;