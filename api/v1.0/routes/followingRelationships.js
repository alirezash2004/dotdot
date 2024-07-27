import { Router } from 'express';
import { checkIsFollowing, newFollowing, removeFollowing } from '../controllers/followingRelationshipsController.js';
const router = Router();

router.get('/followingRelationships/checkIsFollowing', checkIsFollowing);

router.post('/followingRelationships/newFollowing', newFollowing);

router.delete('/followingRelationships/removeFollowing', removeFollowing);

export default router;