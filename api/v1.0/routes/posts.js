// /api/v1.0/posts
import express from 'express';
import { deletePostByPostId, getPostByPostId, newPost } from '../controllers/postController.js';
import { checkSchema } from 'express-validator';
import postsSchema from '../validators/schemas/postsSchema.js';
const router = express.Router();

// Get single post by postId
router.get('/posts/:postId', checkSchema({
    postId: {
        exists: {
            errorMessage: 'postId is required'
        },
        isEmpty: { negated: true },
        trim: true
    }
}, ['params']), getPostByPostId);

router.post('/posts/newPost', checkSchema(postsSchema), newPost);

router.delete('/posts/delPost/:postId', checkSchema({
    postId: {
        exists: {
            errorMessage: 'postId is required'
        },
        isEmpty: { negated: true },
        trim: true
    }
}, ['params']), deletePostByPostId);

export default router;