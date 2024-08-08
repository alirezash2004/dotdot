import { Router } from 'express';
import { checkIsFollowing, newFollowing, removeFollowing } from '../controllers/followingRelationshipsController.js';
import { checkSchema } from 'express-validator';
import followingRelationshipShcema from '../validators/followingRelationship.schema.js';
import validationResultHandler from '../middleware/validationResultHandler.js';
import passport from 'passport';
const router = Router();

router.get('/followingRelationships', passport.authenticate('jwt', { session: false }), checkSchema(followingRelationshipShcema), validationResultHandler, checkIsFollowing);

router.post('/followingRelationships', passport.authenticate('jwt', { session: false }), checkSchema(followingRelationshipShcema), validationResultHandler, newFollowing);

router.delete('/followingRelationships', passport.authenticate('jwt', { session: false }), checkSchema(followingRelationshipShcema), validationResultHandler, removeFollowing);

// TODO: add get followings and get followers

export default router;