import Page from '../models/page.model.js';
import FollowingRelationship from '../models/followingRelationship.model.js';
import { isValidObjectId } from 'mongoose';

const validatePageIds = (pageIds, currentPageId) => {
    if (pageIds[0].objectId !== currentPageId && pageIds[1].objectId !== currentPageId) {
        const error = new Error(`One of pages must be you`);
        error.status = 400;
        return error;
    }

    if (pageIds[0].objectId === pageIds[1].objectId) {
        const error = new Error(`A page cannot have a following relationship with itself!`);
        error.status = 400;
        return error;
    }

    for (let page of pageIds) {
        const isValidPageId = isValidObjectId(page.objectId);

        if (!isValidPageId) {
            const error = new Error(`${page.title} is not valid!`);
            error.status = 400;
            return error;
        }
    }

    return true;
}

// checks if pageId is following followedPageId
export const checkIsFollowing = async (req, res, next) => {
    const data = req.validatedData;

    const pageId = data.pageId;
    const followedPageId = data.followedPageId;

    const validate = validatePageIds(
        [
            { objectId: pageId, title: 'pageId' },
            { objectId: followedPageId, title: 'followedPageId' }
        ], req.user._id.toString());

    if (validate instanceof Error) {
        return next(validate);
    }

    const isFollowing = await FollowingRelationship.exists({ pageId: pageId, followedPageId: followedPageId }).exec();
    if (!isFollowing) {
        return res.status(200).json({ isFollowing: false });
    }

    res.status(200).json({ isFollowing: true });
}

// makes pageId follow-> followedPageId
export const newFollowing = async (req, res, next) => {
    const authPageId = req.user._id.toString();
    const data = req.validatedData;
    const pageId = data.pageId;
    const followedPageId = data.followedPageId;

    const validate = validatePageIds(
        [
            { objectId: pageId, title: 'pageId' },
            { objectId: followedPageId, title: 'followedPageId' }
        ], authPageId);

    if (validate instanceof Error) {
        return next(validate);
    }

    const isCurrentyFollowing = await FollowingRelationship.exists({ pageId: pageId, followedPageId: followedPageId }).exec();
    if (isCurrentyFollowing) {
        const error = new Error(`Page with id ${pageId} is currently following ${followedPageId}`);
        error.status = 409;
        return next(error);
    }

    if (pageId === authPageId) {
        const targetPageExists = await Page.exists({ _id: followedPageId }).exec();
        if (!targetPageExists) {
            const error = new Error(`Page with id ${followedPageId} does not exist!`);
            error.status = 400;
            return next(error);
        }
    } else if (followedPageId === authPageId) {
        const targetPageExists = await Page.exists({ _id: pageId }).exec();
        if (!targetPageExists) {
            const error = new Error(`Page with id ${pageId} does not exist!`);
            error.status = 400;
            return next(error);
        }
    }


    const followingRelationshipData =
    {
        pageId: pageId,
        followedPageId: followedPageId,
        followedAt: Date.now()
    };

    const followingRelationship = new FollowingRelationship(followingRelationshipData);

    followingRelationship.save()
        .then(async (val) => {
            await Page.findByIdAndUpdate(pageId, { $inc: { followingCount: 1 } }).exec();
            await Page.findByIdAndUpdate(followedPageId, { $inc: { followersCount: 1 } }).exec();

            res.status(200).json({ success: true });
        })
        .catch((err) => {
            const error = new Error(err);
            error.status = 500;
            return next(error);
        })
}

// pageId unfollows followedPageId
export const removeFollowing = async (req, res, next) => {
    const data = req.validatedData;
    const pageId = data.pageId;
    const followedPageId = data.followedPageId;

    const validate = validatePageIds(
        [
            { objectId: pageId, title: 'pageId' },
            { objectId: followedPageId, title: 'followedPageId' }
        ], req.user._id.toString());

    if (validate instanceof Error) {
        return next(validate);
    }

    const isCurrentyFollowing = await FollowingRelationship.exists({ pageId: pageId, followedPageId: followedPageId }).exec();
    if (!isCurrentyFollowing) {
        const error = new Error(`Page with id ${pageId} is not following ${followedPageId}`);
        error.status = 409;
        return next(error);
    }

    FollowingRelationship.findOneAndDelete({ pageId: pageId, followedPageId: followedPageId })
        .exec()
        .then(() => {
            Page.findByIdAndUpdate(pageId, { $inc: { followingCount: -1 } }).exec();
            Page.findByIdAndUpdate(followedPageId, { $inc: { followersCount: -1 } }).exec();

            res.status(200).json({ success: true });
        })
        .catch((err) => {
            res.status(500).json({ success: false, err });
        })
}