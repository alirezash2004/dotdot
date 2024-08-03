import { Router } from 'express';
import { checkIsFollowing, newFollowing, removeFollowing } from '../controllers/followingRelationshipsController.js';
import { checkSchema } from 'express-validator';
import followingRelationshipShcema from '../validators/schemas/followingRelationshipSchema.js';
import validationResultHandler from '../middleware/validationResultHandler.js';
const router = Router();

router.get('/followingRelationships/checkIsFollowing', checkSchema(followingRelationshipShcema), validationResultHandler, checkIsFollowing);

router.post('/followingRelationships/newFollowing', checkSchema(followingRelationshipShcema), validationResultHandler, newFollowing);

router.delete('/followingRelationships/removeFollowing', checkSchema(followingRelationshipShcema), validationResultHandler, removeFollowing);

// TODO: add get followings and get followers

export default router;