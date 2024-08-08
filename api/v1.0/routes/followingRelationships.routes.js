import { Router } from 'express';
import { checkIsFollowing, newFollowing, removeFollowing } from '../controllers/followingRelationships.controller.js';
import { checkSchema } from 'express-validator';
import followingRelationshipShcema from '../validators/followingRelationship.schema.js';
import validationResultHandler from '../middleware/validationResultHandler.js';
import protectRoute from '../middleware/protectRoute.js';
const router = Router();

router.get('/followingRelationships', protectRoute, checkSchema(followingRelationshipShcema), validationResultHandler, checkIsFollowing);

router.post('/followingRelationships', protectRoute, checkSchema(followingRelationshipShcema), validationResultHandler, newFollowing);

router.delete('/followingRelationships', protectRoute, checkSchema(followingRelationshipShcema), validationResultHandler, removeFollowing);

// TODO: add get followings and get followers

export default router;