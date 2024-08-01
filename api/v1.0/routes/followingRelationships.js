import { Router } from 'express';
import { checkIsFollowing, newFollowing, removeFollowing } from '../controllers/followingRelationshipsController.js';
import { checkSchema } from 'express-validator';
import followingRelationshipShcema from '../validators/schemas/followingRelationshipSchema.js';
const router = Router();

router.get('/followingRelationships/checkIsFollowing', checkSchema(followingRelationshipShcema), checkIsFollowing);

router.post('/followingRelationships/newFollowing', checkSchema(followingRelationshipShcema), newFollowing);

router.delete('/followingRelationships/removeFollowing', checkSchema(followingRelationshipShcema), removeFollowing);

// TODO: add get followings and get followers

export default router;