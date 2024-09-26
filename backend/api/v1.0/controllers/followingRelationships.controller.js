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

        const followingRelation = await FollowingRelationship.findOne({ pageId: pageId, followedPageId: followedPageId }).exec();
        if (!followingRelation) {
            return res.status(200).json({ success: true, followingStatus: 'none' });
        }

        return res.status(200).json({ success: true, followingStatus: followingRelation.status });
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
            followings.map(following => FollowingRelationship.exists({ pageId: myPageId, followedPageId: following.pageId, status: 'accepted' }))
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
export const followByPageId = async (req, res, next) => {
    try {
        const authPageId = req.user._id.toString();
        const data = req.validatedData;
        const pageId = data.pageId;

        const isValidPageId = isValidObjectId(pageId);
        if (!isValidPageId) {
            const error = new Error(`pageId is not valid!`);
            error.status = 400;
            return next(error);
        }

        const targetPage = await Page.findById(pageId).select('pageType').exec();

        if (!targetPage) {
            const error = new Error(`Page with id ${pageId} was not found`);
            error.status = 404;
            return next(error);
        }

        const followingRelation = await FollowingRelationship.findOne({ pageId: authPageId, followedPageId: pageId }).exec();

        if (followingRelation) {
            if (followingRelation.status === 'accepted') {
                return res.status(409).json({ success: true, message: 'Already following' });
            } else if (followingRelation.status === 'pending') {
                return res.status(409).json({ success: true, message: 'Request already sent' });
            }
        }

        const targetPageType = targetPage.pageType;

        const followingRelationshipData =
        {
            pageId: authPageId,
            followedPageId: pageId,
            followedAt: Date.now(),
            status: 'pending',
        };

        if (targetPageType === 'public') {
            followingRelationshipData.status = 'accepted';

            const followingRelationship = new FollowingRelationship(followingRelationshipData);

            const notification = new Notification({
                from: authPageId,
                to: pageId,
                type: 'follow',
            });

            await Promise.all([
                followingRelationship.save(),
                Page.findByIdAndUpdate(authPageId, { $inc: { followingCount: 1 } }).exec(),
                Page.findByIdAndUpdate(pageId, { $inc: { followersCount: 1 } }).exec(),
                notification.save(),
            ])

            return res.status(200).json({ success: true, msg: "Followed Successfully" });
        }

        const followingRelationship = new FollowingRelationship(followingRelationshipData);

        await followingRelationship.save();

        return res.status(200).json({ success: true, msg: "Follow Request Sent" });
    } catch (err) {
        console.log(`Error in newFollowing : ${err}`);
        const error = new Error(`Internal Server Error`)
        error.status = 500;
        return next(error);
    }
}

export const acceptFollow = async (req, res, next) => {
    try {
        const authPageId = req.user._id.toString();
        const data = req.validatedData;
        const followingRelationshipId = data.id;

        const isValidPageId = isValidObjectId(followingRelationshipId);

        if (!isValidPageId) {
            const error = new Error(`id is not valid!`);
            error.status = 400;
            return next(error);
        }

        const followingRelationship = await FollowingRelationship.findById(followingRelationshipId).exec();

        if (!followingRelationship) {
            const error = new Error(`Requested Following Relation not found!`);
            error.status = 404;
            return next(error);
        }

        if (followingRelationship.followedPageId.toString() !== authPageId) {
            const error = new Error(`Unauthorized`);
            error.status = 401;
            return next(error);
        }

        if (followingRelationship.status === 'accepted') {
            const error = new Error(`Request already accepted!`);
            error.status = 409;
            return next(error);
        }

        followingRelationship.status = 'accepted';

        const notification = new Notification({
            from: authPageId,
            to: followingRelationship.pageId,
            type: 'followAccept'
        })

        await Promise.all([
            followingRelationship.save(),
            Page.findByIdAndUpdate(authPageId, { $inc: { followersCount: 1 } }).exec(),
            Page.findByIdAndUpdate(followingRelationship.pageId, { $inc: { followingCount: 1 } }).exec(),
            notification.save()
        ])

        return res.status(200).json({ success: true, msg: "Follow Request Accepted Successfully" });
    } catch (err) {
        console.log(`Error in acceptFollow : ${err}`);
        const error = new Error(`Internal Server Error`)
        error.status = 500;
        return next(error);
    }
}

export const declineFollow = async (req, res, next) => {
    try {
        const authPageId = req.user._id.toString();
        const data = req.validatedData;
        const followingRelationshipId = data.id;

        const isValidPageId = isValidObjectId(followingRelationshipId);

        if (!isValidPageId) {
            const error = new Error(`id is not valid!`);
            error.status = 400;
            return next(error);
        }

        const followingRelationship = await FollowingRelationship.findById(followingRelationshipId).exec();

        if (!followingRelationship) {
            const error = new Error(`Requested Following Relation not found!`);
            error.status = 404;
            return next(error);
        }

        if (followingRelationship.followedPageId.toString() !== authPageId) {
            const error = new Error(`Unauthorized`);
            error.status = 401;
            return next(error);
        }

        if (followingRelationship.status === 'accepted') {
            const error = new Error(`Following Relation already accepted!`);
            error.status = 409;
            return next(error);
        }

        await FollowingRelationship.deleteOne({ _id: followingRelationship._id });

        return res.status(200).json({ success: true, msg: "Follow Request Declined Successfully" });
    } catch (err) {
        console.log(`Error in declineFollow : ${err}`);
        const error = new Error(`Internal Server Error`)
        error.status = 500;
        return next(error);
    }
}

// pageId unfollows followedPageId
export const removeFollowing = async (req, res, next) => {
    try {
        const authPageId = req.user._id;
        const { pageId } = req.validatedData;

        const isValidPageId = isValidObjectId(pageId);
        if (!isValidPageId) {
            const error = new Error(`pageId is not valid!`);
            error.status = 400;
            return next(error);
        }

        const followingRelationship = await FollowingRelationship.findOne({ pageId: authPageId, followedPageId: pageId }).exec();

        if (!followingRelationship) {
            const error = new Error(`Following Relation not found!`);
            error.status = 404;
            return next(error);
        }

        await FollowingRelationship.deleteOne({ _id: followingRelationship._id });

        if (followingRelationship.status === 'accepted') {
            await Promise.all([
                Notification.deleteOne({ from: followingRelationship.pageId, to: followingRelationship.followedPageId, type: 'follow' }),
                Page.findByIdAndUpdate(authPageId, { $inc: { followingCount: -1 } }).exec(),
                Page.findByIdAndUpdate(pageId, { $inc: { followersCount: -1 } }).exec(),
            ])
        }

        return res.status(200).json({ success: true, msg: "Unfollowed Successfully" });
    } catch (err) {
        console.log(`Error in removeFollowing : ${err}`);
        const error = new Error(`Internal Server Error`)
        error.status = 500;
        return next(error);
    }
}