import { sampleFollowingRelationship } from '../helpers/mockuser.js';

export const checkIsFollowing = (req, res, next) => {
    const { body } = req;
    const pageId = parseInt(body.pageId);
    const followedPageId = parseInt(body.followedPageId);

    if (pageId === followedPageId) {
        const error = new Error(`A page cannot have a following relationship with itself!`);
        error.status = 400;
        return next(error);
    }

    if (!pageId) {
        const error = new Error(`pageId ${pageId} is not correct`);
        error.status = 400;
        return next(error);
    }
    if (!followedPageId) {
        const error = new Error(`followedPageId ${followedPageId} is not correct`);
        error.status = 400;
        return next(error);
    }

    const isFollowing = sampleFollowingRelationship.find(followingRelationship => followingRelationship.pageId === pageId && followingRelationship.followedPageId === followedPageId);
    if (!isFollowing) {
        return res.status(200).json({ isFollowing: false });
    }

    res.status(200).json({ isFollowing: true });
}

export const newFollowing = (req, res, next) => {
    const { body } = req;
    const pageId = parseInt(body.pageId);
    const followedPageId = parseInt(body.followedPageId);

    if (pageId === followedPageId) {
        const error = new Error(`A page cannot have a following relationship with itself!`);
        error.status = 400;
        return next(error);
    }

    if (!pageId) {
        const error = new Error(`pageId ${pageId} is not correct`);
        error.status = 400;
        return next(error);
    }
    if (!followedPageId) {
        const error = new Error(`followedPageId ${followedPageId} is not correct`);
        error.status = 400;
        return next(error);
    }

    const isCurrentyFollowing = sampleFollowingRelationship.find(followingRelationship => followingRelationship.pageId === pageId && followingRelationship.followedPageId === followedPageId);
    if (isCurrentyFollowing) {
        const error = new Error(`Page with id ${pageId} is currently following ${followedPageId}`);
        error.status = 409;
        return next(error);
    }

    const followingRelationship =
    {
        id: sampleFollowingRelationship[sampleFollowingRelationship.length - 1].id + 1,
        pageId: pageId,
        followedPageId: followedPageId,
        followedAt: Date()
    };

    sampleFollowingRelationship.push(followingRelationship);

    res.status(200).json(sampleFollowingRelationship);
}

export const removeFollowing = (req, res, next) => {
    const { body } = req;
    const pageId = parseInt(body.pageId);
    const followedPageId = parseInt(body.followedPageId);

    if (pageId === followedPageId) {
        const error = new Error(`A page cannot have a following relationship with itself!`);
        error.status = 400;
        return next(error);
    }

    if (!pageId) {
        const error = new Error(`pageId ${pageId} is not correct`);
        error.status = 400;
        return next(error);
    }
    if (!followedPageId) {
        const error = new Error(`followedPageId ${followedPageId} is not correct`);
        error.status = 400;
        return next(error);
    }

    const followingRelationship = sampleFollowingRelationship.find(followingRelationship => followingRelationship.pageId === pageId && followingRelationship.followedPageId === followedPageId);
    if (!followingRelationship) {
        const error = new Error(`Page with id ${pageId} is not following ${followedPageId}`);
        error.status = 406;
        return next(error);
    }

    sampleFollowingRelationship.splice(sampleFollowingRelationship.indexOf(followingRelationship), 1);

    res.status(200).json({ success: true });
}

export const getFollowingsCount = (req) => {
    const { body } = req;
    const pageId = parseInt(body.pageId);

    const followingRelationships = sampleFollowingRelationship.filter(followingRelationship => followingRelationship.pageId === pageId);

    return followingRelationships.length;
}

export const getFollowersCount = (req) => {
    const { body } = req;
    const pageId = parseInt(body.pageId);

    const followingRelationships = sampleFollowingRelationship.filter(followingRelationship => followingRelationship.followedPageId === pageId);

    return followingRelationships.length;
}