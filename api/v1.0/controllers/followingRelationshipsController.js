import { matchedData, validationResult } from 'express-validator';
import { FollowingRelationship, Page } from '../mongoose/schemas/page.js';
import mongoose from 'mongoose';

// checks if pageId is following followedPageId
export const checkIsFollowing = async (req, res, next) => {
    // input validation
    const result = validationResult(req).array({ onlyFirstError: true });
    if (result.length !== 0) {
        return res.status(400).send({ msg: result[0].msg });
    }

    const data = matchedData(req);

    const pageId = data.pageId;
    const followedPageId = data.followedPageId;

    if (pageId === followedPageId) {
        const error = new Error(`A page cannot have a following relationship with itself!`);
        error.status = 400;
        return next(error);
    }

    const isValidPageId = mongoose.Types.ObjectId.isValid(pageId);

    if (!isValidPageId) {
        const err = new Error(`pageId is not valid!`);
        err.status = 400;
        return next(err);
    }

    const isValidFollowedPageId = mongoose.Types.ObjectId.isValid(followedPageId);

    if (!isValidFollowedPageId) {
        const err = new Error(`followedPageId is not valid!`);
        err.status = 400;
        return next(err);
    }

    const isFollowing = await FollowingRelationship.exists({ pageId: pageId, followedPageId: followedPageId }).exec();
    if (!isFollowing) {
        return res.status(200).json({ isFollowing: false });
    }

    res.status(200).json({ isFollowing: true });
}

// makes pageId follow-> followedPageId
export const newFollowing = async (req, res, next) => {
    const result = validationResult(req).array({ onlyFirstError: true });
    if (result.length !== 0) {
        return res.status(400).send({ msg: result[0].msg });
    }

    const data = matchedData(req);
    const pageId = data.pageId;
    const followedPageId = data.followedPageId;

    if (pageId === followedPageId) {
        const error = new Error(`A page cannot have a following relationship with itself!`);
        error.status = 400;
        return next(error);
    }

    const isValidPageId = mongoose.Types.ObjectId.isValid(pageId);

    if (!isValidPageId) {
        const err = new Error(`pageId is not valid!`);
        err.status = 400;
        return next(err);
    }

    const isValidFollowedPageId = mongoose.Types.ObjectId.isValid(followedPageId);

    if (!isValidFollowedPageId) {
        const err = new Error(`followedPageId is not valid!`);
        err.status = 400;
        return next(err);
    }


    const isCurrentyFollowing = await FollowingRelationship.exists({ pageId: pageId, followedPageId: followedPageId }).exec();
    if (isCurrentyFollowing) {
        const error = new Error(`Page with id ${pageId} is currently following ${followedPageId}`);
        error.status = 409;
        return next(error);
    }

    const followingRelationshipData =
    {
        pageId: pageId,
        followedPageId: followedPageId,
        followedAt: Date.now()
    };

    const followingRelationship = new FollowingRelationship(followingRelationshipData);

    followingRelationship.save()
        .then((val) => {
            Page.findByIdAndUpdate(pageId, { $inc: { followingCount: 1 } }).exec();
            Page.findByIdAndUpdate(followedPageId, { $inc: { followersCount: 1 } }).exec();

            res.status(200).json(val);
        })
        .catch((err) => {
            const error = new Error(err);
            error.status = 500;
            return next(error);
        })
}

// pageId unfollows followedPageId
export const removeFollowing = async (req, res, next) => {
    const result = validationResult(req).array({ onlyFirstError: true });
    if (result.length !== 0) {
        return res.status(400).send({ msg: result[0].msg });
    }

    const data = matchedData(req);
    const pageId = data.pageId;
    const followedPageId = data.followedPageId;

    if (pageId === followedPageId) {
        const error = new Error(`A page cannot have a following relationship with itself!`);
        error.status = 400;
        return next(error);
    }

    const isValidPageId = mongoose.Types.ObjectId.isValid(pageId);

    if (!isValidPageId) {
        const err = new Error(`pageId is not valid!`);
        err.status = 400;
        return next(err);
    }

    const isValidFollowedPageId = mongoose.Types.ObjectId.isValid(followedPageId);

    if (!isValidFollowedPageId) {
        const err = new Error(`followedPageId is not valid!`);
        err.status = 400;
        return next(err);
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