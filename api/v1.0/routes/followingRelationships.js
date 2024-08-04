import { Router } from 'express';
import { checkIsFollowing, newFollowing, removeFollowing } from '../controllers/followingRelationshipsController.js';
import { checkSchema } from 'express-validator';
import followingRelationshipShcema from '../validators/schemas/followingRelationshipSchema.js';
import validationResultHandler from '../middleware/validationResultHandler.js';
const router = Router();

router.get('/followingRelationships', checkSchema(followingRelationshipShcema), validationResultHandler, checkIsFollowing);

router.post('/followingRelationships', checkSchema(followingRelationshipShcema), validationResultHandler, newFollowing);

router.delete('/followingRelationships', checkSchema(followingRelationshipShcema), validationResultHandler, removeFollowing);

// TODO: add get followings and get followers

export default router;