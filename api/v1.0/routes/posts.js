// /api/v1.0/posts
import express from 'express';
import { getPostByPostId, newPost } from '../controllers/postController.js';
const router = express.Router();

// Get single post by postId
router.get('/posts/:postId', getPostByPostId);

router.post('/posts/:postId', newPost)

export default router;