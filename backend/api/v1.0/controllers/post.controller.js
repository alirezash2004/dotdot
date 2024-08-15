import { isValidObjectId } from 'mongoose';

import Page from '../models/page.model.js';
import FollowingRelationship from '../models/followingRelationship.model.js';
import Post from '../models/post.model.js';
import TmpFiles from '../models/tmpFiles.model.js';
import Notification from '../models/notification.model.js'

export const getRecentPosts = async (req, res, next) => {
    try {
        const pageId = req.user._id.toString();
        const skip = parseInt(req.validatedData.skip) || 0;

        const commentStart = 0;
        const commentCount = 2;

        const posts = await Post
            .find({
                $or: [
                    {
                        page: {
                            $in: await FollowingRelationship
                                .find({ pageId, followedPageId: { $ne: pageId } }, 'followedPageId')
                                .select('followedPageId')
                                .distinct('followedPageId')
                        }
                    },
                    {
                        page: {
                            $in: await Page
                                .find({ _id: { $ne: pageId }, pageType: 'public' }, '_id')
                                .select('_id')
                                .distinct('_id')
                        },
                    },
                ]
            }, {
                comments: { $slice: ['$comments', commentStart, commentStart + commentCount] },
                numberOfLikes: { $size: '$likes' },
                numberOfShares: { $size: '$shares' },
                assets: 1
            })
            .populate({
                path: 'page',
                select: 'username fullName profilePicture pageType',
            })
            .populate({
                path: 'comments',
                populate: {
                    path: 'page',
                    select: 'username fullName profilePicture',
                },
                options: {
                    limit: 2,
                },
            })
            .skip(skip)
            .limit(10)
            .sort({ createdAt: -1 })
            .exec();

        if (posts.length === 0) {
            return res.status(200).json({ success: true, posts: [] });
        }

        res.status(200).json({ success: true, posts: posts });
    } catch (err) {
        console.log(`Error in getRecentPosts : ${err}`);
        const error = new Error(`Internal Server Error`);
        error.status = 500;
        return next(error);
    }
}

// @desc   Get signle post
// @route  GET /api/v1.0/posts/:postId
// Access
export const getPostByPostId = async (req, res, next) => {
    try {
        const data = req.validatedData;
        const postId = data.postId;

        const isValidId = isValidObjectId(postId);

        if (!isValidId) {
            const err = new Error(`postId is not valid!`);
            err.status = 400;
            return next(err);
        }

        // TODO: make select more optimized (count likes, ... in query , ...)
        const post = await Post.findById(postId).exec();

        if (!post) {
            const error = new Error(`A post with post id ${postId} was not found`);
            error.status = 404;
            return next(error);
        }

        // check if page for the post is private then should be following else don't return post
        // for public pages no restriction
        // self posts also no restriction
        const currentPageId = req.user._id.toString();
        const targetPageId = post.page.toString();

        const [targetPageType, isFollowing] = await Promise.all([
            Page.findById(targetPageId).select('pageType').exec(),
            FollowingRelationship.exists({ pageId: currentPageId, followedPageId: targetPageId }).exec(),
        ])

        if (targetPageId !== currentPageId && (targetPageType.pageType === 'private' && !isFollowing)) {
            const error = new Error(`Page Is Private You have to follow it first`);
            error.status = 401;
            return next(error);
        }

        return res.status(200).json({
            assetType: post.assetType,
            type: post.type,
            caption: post.caption,
            assets: post.assets,
            createdAt: post.createdAt,
            shareCount: post.shares.length,
            likeCount: post.likes.length,
            commentCount: post.comments.length,
        });
    } catch (err) {
        console.log(`Error in getPostByPostId : ${err}`);
        const error = new Error(`Internal Server Error`)
        error.status = 500;
        return next(error);
    }
}

export const getLikedPosts = async (req, res, next) => {
    try {
        const page = req.user;

        // TODO: add thumbnail and return thumbnail and id of posts
        const likedPosts = await Post.find({ _id: { $in: page.likedPosts } })
            .select('assetType type caption assets')

        res.status(200).json({ success: true, posts: likedPosts });
    } catch (err) {
        console.log(`Error in getLikedPosts : ${err}`);
        const error = new Error(`Internal Server Error`);
        error.status = 500;
        return next(error);
    }
}

export const getPagePosts = async (req, res, next) => {
    try {
        const pageId = req.user._id.toString();
        const data = req.validatedData;
        const username = data.username;
        const skip = parseInt(data.skip) || 0;

        const targetPage = await Page.findOne({ username }).select('pageType').exec();
        if (!targetPage) {
            const error = new Error(`A page with username ${username} was not found`);
            error.status = 404;
            return next(error);
        }

        const isFollowing = await FollowingRelationship.exists({ pageId: pageId, followedPageId: targetPage._id }).exec();
        if (targetPage._id.toString() !== pageId && (targetPage.pageType === 'private' && !isFollowing)) {
            const error = new Error(`Page Is Private You have to follow it first`);
            error.status = 401;
            return next(error);
        }

        const posts = await Post
            .find({ page: targetPage._id })
            .select('assetType type caption assets')
            .skip(skip)
            .limit(10)
            .sort({ createdAt: -1 })
            .exec();

        res.status(200).json({ success: true, posts: posts });
    } catch (err) {
        console.log(`Error in getPagePosts : ${err}`);
        const error = new Error(`Internal Server Error`);
        error.status = 500;
        return next(error);
    }
}

export const newPost = async (req, res, next) => {
    try {
        // single image post

        const data = req.validatedData;

        const { type, assetType, caption, postmedia } = data;

        const pageId = req.user._id.toString();

        const pm = postmedia;

        if (assetType === 'picture') {
            const mediaAccessTokens = pm.mediaAccessTokens;
            const medias = [];

            for (let i = 0; i < mediaAccessTokens.length; i++) {
                const mediaAccessToken = mediaAccessTokens[i].trim();

                const validToken = /^[a-z0-9]{72}$/.test(mediaAccessToken);
                if (!validToken) {
                    const error = new Error(`Media Access Token Is Not Valid`);
                    error.status = 400;
                    return next(error);
                }

                const media = await TmpFiles.findOne({ fileAccesstoken: mediaAccessToken, pageId: pageId }).exec();

                if (!media) {
                    const error = new Error(`A postmedia with token ${mediaAccessToken} was not found!`);
                    error.status = 404;
                    return next(error);
                }

                medias.push(media);
            }

            const post = {
                page: pageId,
                type: type,
                caption: caption,
                assetType: assetType,
            }

            const newPost = new Post(post);

            for (let i = 0; i < medias.length; i++) {
                const media = medias[i];

                newPost.assets.push({ url: media.url });
            }

            await Promise.all([
                newPost.save(),
                TmpFiles.deleteMany({ pageId: pageId }).exec(),
                Page.findByIdAndUpdate(pageId, { $inc: { postsCount: 1 } }).exec(),
            ])

            return res.status(200).json({ success: true, postId: newPost._id });
        } else if (assetType === 'video') {
            // TODO: upload video
        } else {
            const error = new Error(`assetType ${assetType} is not supported!`);
            error.status = 500;
            return next(error);
        }

    } catch (err) {
        console.log(`Error in newPost : ${err}`);
        const error = new Error(`Internal Server Error`)
        error.status = 500;
        return next(error);
    }
}

export const likeUnlikePost = async (req, res, next) => {
    try {
        const data = req.validatedData;
        const pageId = req.user._id.toString();
        const postId = data.postId;

        const post = await Post.findById(postId).exec();
        if (!post) {
            const error = new Error(`A post with post id ${postId} was not found`);
            error.status = 404;
            return next(error)
        }

        const targetPageId = post.page.toString();

        const [targetPageType, isFollowing] = await Promise.all([
            Page.findById(targetPageId).select('pageType').exec(),
            FollowingRelationship.exists({ pageId: pageId, followedPageId: targetPageId }).exec(),
        ])

        if (targetPageId !== pageId && (targetPageType.pageType === 'private' && !isFollowing)) {
            const error = new Error(`The Page Who Posted This Post Is Private You have to follow it first`);
            error.status = 401;
            return next(error);
        }

        const userLikedPost = post.likes.includes(pageId);

        if (userLikedPost) {
            // unlike post
            await Post.updateOne({ _id: postId }, { $pull: { likes: pageId } });
            await Page.updateOne({ _id: pageId }, { $pull: { likedPosts: postId } });
            res.status(200).json({ success: true, msg: 'Post Unliked Successfully' });
        } else {
            // like post
            post.likes.push(pageId);
            await Page.updateOne({ _id: pageId }, { $push: { likedPosts: postId } });
            await post.save();

            const notification = new Notification({
                from: pageId,
                to: targetPageId,
                type: 'like',
            });

            await notification.save();

            res.status(200).json({ success: true, msg: 'Post Liked Successfully' });
        }
    } catch (err) {
        console.log(`Error in likeUnlikePost : ${err}`);
        const error = new Error(`Internal Server Error`)
        error.status = 500;
        return next(error);
    }
}

export const commentOnPost = async (req, res, next) => {
    try {
        const data = req.validatedData;
        const text = data.text;
        const pageId = req.user._id.toString();
        const postId = data.postId;

        const post = await Post.findById(postId).exec();
        if (!post) {
            const error = new Error(`A post with post id ${postId} was not found`);
            error.status = 404;
            return next(error)
        }

        const targetPageId = post.page.toString();

        const [targetPageType, isFollowing] = await Promise.all([
            Page.findById(targetPageId).select('pageType').exec(),
            FollowingRelationship.exists({ pageId: pageId, followedPageId: targetPageId }).exec(),
        ])

        if (targetPageId !== pageId && (targetPageType.pageType === 'private' && !isFollowing)) {
            const error = new Error(`The Page Who Posted This Post Is Private You have to follow it first`);
            error.status = 401;
            return next(error);
        }

        const comment = { page: pageId, text };

        post.comments.push(comment);
        await post.save();

        const notification = new Notification({
            from: pageId,
            to: targetPageId,
            type: 'comment',
        });

        await notification.save();

        return res.status(200).json({ success: true, postId: post._id });
    } catch (err) {
        console.log(`Error in CommentOnPost : ${err}`);
        const error = new Error(`Internal Server Error`)
        error.status = 500;
        return next(error);
    }
}

export const deletePostByPostId = async (req, res, next) => {
    try {

        const pageId = req.user._id.toString();

        const data = req.validatedData;

        const postId = data.postId;

        const isValidId = isValidObjectId(postId);

        if (!isValidId) {
            const err = new Error(`postId is not valid!`);
            err.status = 400;
            return next(err);
        }

        const post = await Post.findById(postId).select('page').exec()

        if (!post) {
            const error = new Error(`A post with post id ${postId} was not found`);
            error.status = 404;
            return next(error);
        }

        if (post.page.toString() !== pageId) {
            const error = new Error(`You can only delete your posts!`);
            error.status = 401;
            return next(error);
        }

        await Promise.all([
            // PostMedia.deleteMany({ postId }).exec(), // delete all post media
            PostComments.deleteMany({ postId }).exec(), // delete all post comments
            Post.deleteOne({ _id: postId }).exec(),
            Page.findByIdAndUpdate(pageId, { $inc: { postsCount: -1 } }).exec(),
        ])

        return res.status(200).json({ success: true, msg: 'post deleted!' });

    } catch (err) {
        console.log(`Error in deletePostByPostId : ${err}`);
        const error = new Error(`Internal Server Error`)
        error.status = 500;
        return next(error);
    }
}