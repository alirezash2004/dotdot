import { Router } from 'express';
import { checkSchema } from 'express-validator';

import protectRoute from '../middleware/protectRoute.js';
import validationResultHandler from '../middleware/validationResultHandler.js';

import { acceptFollow, checkIsFollowing, declineFollow, getFollowers, getFollowings, removeFollowing, followByPageId } from '../controllers/followingRelationships.controller.js';

import followingRelationshipShcema from '../validators/followingRelationship.schema.js';
import { followingRelationshipIdSchema, pageIdSchema, skipQuerySchema } from '../validators/global.schema.js';

const router = Router();

router.get('/', protectRoute, checkSchema(followingRelationshipShcema), validationResultHandler, checkIsFollowing);

router.get('/followers/:pageId', protectRoute, checkSchema(skipQuerySchema, ['query']), checkSchema(pageIdSchema, ['params']), validationResultHandler, getFollowers)

router.get('/followings/:pageId', protectRoute, checkSchema(skipQuerySchema, ['query']), checkSchema(pageIdSchema, ['params']), validationResultHandler, getFollowings)

router.post('/', protectRoute, checkSchema(pageIdSchema, ['body']), validationResultHandler, followByPageId);

router.post('/action/:id', protectRoute, checkSchema(followingRelationshipIdSchema, ['params']), validationResultHandler, acceptFollow);

router.delete('/action/:id', protectRoute, checkSchema(followingRelationshipIdSchema, ['params']), validationResultHandler, declineFollow);

router.delete('/', protectRoute, checkSchema(pageIdSchema, ['body']), validationResultHandler, removeFollowing);

// TODO: add get followings and get followers

export default router;