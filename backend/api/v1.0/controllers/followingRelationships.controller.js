import mongoose, { isValidObjectId } from 'mongoose';

import Page from '../models/page.model.js';
import FollowingRelationship from '../models/followingRelationship.model.js';
import Notification from '../models/notification.model.js';

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
    try {
        const { pageId, followedPageId } = req.validatedData;

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
            return res.status(200).json({ success: true, isFollowing: false });
        }

        return res.status(200).json({ success: true, isFollowing: true });
    } catch (err) {
        console.log(`Error in checkIsFollowing : ${err}`);
        const error = new Error(`Internal Server Error`)
        error.status = 500;
        return next(error);
    }
}

export const getFollowers = async (req, res, next) => {
    try {
        const myPageId = req.user._id.toString()
        const data = req.validatedData;
        const { pageId } = data;

        const skip = parseInt(data.skip) || 0;

        const isValidPageId = isValidObjectId(pageId);

        if (!isValidPageId) {
            const error = new Error(`pageId is not valid!`);
            error.status = 400;
            return error;
        }

        // TODO: optimize (move find fillowingrealtionship to promise.all)
        const [targetPageType, isFollowing] = await Promise.all([
            Page.findById(pageId).select('pageType').exec(),
            FollowingRelationship.exists({ pageId: myPageId, followedPageId: pageId }).exec(),
        ])

        if (pageId !== myPageId && (targetPageType.pageType === 'private' && !isFollowing)) {
            const error = new Error(`Page Is Private You have to follow it first`);
            error.status = 401;
            return next(error);
        }

        const followers = await FollowingRelationship
            .find({ pageId: { $ne: myPageId }, followedPageId: pageId })
            .select('pageId')
            .populate({
                path: 'pageId',
                select: 'username fullName profilePicture pageType',
            })
            .skip(skip)
            .limit(10)
            .exec();

        const followingRes = await Promise.all(
            followers.map(follower => FollowingRelationship.exists({ pageId: myPageId, followedPageId: follower.pageId }))
        )

        const followersWithMyFollowingStatus = followers.map((follower, idx) => { return { ...follower.toObject(), isFollowing: !!followingRes[idx] } })

        return res.status(200).json({ success: true, data: followersWithMyFollowingStatus });

    } catch (err) {
        console.log(`Error in getFollowers : ${err}`);
        const error = new Error(`Internal Server Error`)
        error.status = 500;
        return next(error);
    }
}

export const getFollowings = async (req, res, next) => {
    try {
        const myPageId = req.user._id.toString()
        const data = req.validatedData;
        const { pageId } = data;

        const skip = parseInt(data.skip) || 0;

        const isValidPageId = isValidObjectId(pageId);

        if (!isValidPageId) {
            const error = new Error(`pageId is not valid!`);
            error.status = 400;
            return error;
        }

        const [targetPageType, isFollowing] = await Promise.all([
            Page.findById(pageId).select('pageType').exec(),
            FollowingRelationship.exists({ pageId: myPageId, followedPageId: pageId }).exec(),
        ])

        if (pageId !== myPageId && (targetPageType.pageType === 'private' && !isFollowing)) {
            const error = new Error(`Page Is Private You have to follow it first`);
            error.status = 401;
            return next(error);
        }

        const followings = await FollowingRelationship
            .find({ pageId: pageId, followedPageId: { $ne: myPageId } })
            .select('followedPageId')
            .populate({
                path: 'followedPageId',
                select: 'username fullName profilePicture pageType',
            })
            .skip(skip)
            .limit(10)
            .exec();

        const followingRes = await Promise.all(
            followings.map(following => FollowingRelationship.exists({ pageId: myPageId, followedPageId: following.pageId }))
        )

        const followingsWithMyFollowingStatus = followings.map((following, idx) => { return { ...following.toObject(), isFollowing: !!followingRes[idx] } })

        return res.status(200).json({ success: true, data: followingsWithMyFollowingStatus });

    } catch (err) {
        console.log(`Error in getfollowings : ${err}`);
        const error = new Error(`Internal Server Error`)
        error.status = 500;
        return next(error);
    }
}

// makes pageId follow-> followedPageId
export const newFollowing = async (req, res, next) => {
    // TODO: add following requests
    // currently pages can make other pages follow themself which is not good
    try {
        const authPageId = req.user._id.toString();
        const { pageId, followedPageId } = req.validatedData;

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

        await followingRelationship.save();

        let notification = await Notification.findOne({ from: pageId, to: followedPageId, type: 'follow' });

        if (!notification) {
            notification = new Notification({
                from: pageId,
                to: followedPageId,
                type: 'follow',
            });
        }

        await Promise.all([
            Page.findByIdAndUpdate(pageId, { $inc: { followingCount: 1 } }).exec(),
            Page.findByIdAndUpdate(followedPageId, { $inc: { followersCount: 1 } }).exec(),
            notification.save(),
        ])

        return res.status(200).json({ success: true });
    } catch (err) {
        console.log(`Error in newFollowing : ${err}`);
        const error = new Error(`Internal Server Error`)
        error.status = 500;
        return next(error);
    }
}

// pageId unfollows followedPageId
export const removeFollowing = async (req, res, next) => {
    try {
        const { pageId, followedPageId } = req.validatedData;

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

        await Promise.all([
            FollowingRelationship.deleteOne({ pageId: pageId, followedPageId: followedPageId }).exec(),
            Page.findByIdAndUpdate(pageId, { $inc: { followingCount: -1 } }).exec(),
            Page.findByIdAndUpdate(followedPageId, { $inc: { followersCount: -1 } }).exec(),
            // Notification.deleteOne({ from: pageId, to: followedPageId, type: 'follow' })
        ])

        res.status(200).json({ success: true });
    } catch (err) {
        console.log(`Error in removeFollowing : ${err}`);
        const error = new Error(`Internal Server Error`)
        error.status = 500;
        return next(error);
    }
}