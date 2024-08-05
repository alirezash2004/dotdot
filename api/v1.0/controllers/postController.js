import { isValidObjectId } from 'mongoose';
import { FollowingRelationship, Page } from '../mongoose/schemas/page.js';
import { Post, PostComments, PostMedia, TmpFiles } from '../mongoose/schemas/post.js';
import { isJson } from '../utils/checkIsJson.js';

// @desc   Get signle post
// @route  GET /api/v1.0/posts/:postId
// Access
export const getPostByPostId = async (req, res, next) => {
    const data = req.validatedData;
    const postId = data.postId;

    const isValidId = isValidObjectId(postId);

    if (!isValidId) {
        const err = new Error(`postId is not valid!`);
        err.status = 400;
        return next(err);
    }

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
    const targetPageId = post.pageId.toString();
    const targetPageType = await Page.findById(targetPageId).select('pageType').exec();
    console.log(`currentPageId: ${currentPageId}`);
    console.log(`targetPageId: ${targetPageId}`);
    console.log(`targetPageType: ${targetPageType.pageType}`);

    const isFollowing = await FollowingRelationship.exists({ pageId: currentPageId, followedPageId: targetPageId }).exec();
    if (targetPageId !== currentPageId && (targetPageType.pageType === 'private' && !isFollowing)) {
        const error = new Error(`Page Is Private You have to follow it first`);
        error.status = 401;
        return next(error);
    }

    let postMedias = await PostMedia.find({ postId }).select('slideNumber assetUrl ext').exec();

    if (postMedias.length == 1) {
        postMedias = postMedias[0]
    }

    // TODO: fetch comments
    // const returnComments = Boolean(req.query.comments === 'true');
    // if (!returnComments) {
    //     post.comments = [];
    //     return res.status(200).json(post);
    // }

    // const currentPostComments = postComments.filter((comment) => comment.postId === postId);
    // post.comments = currentPostComments;

    res.status(200).json({
        assetType: post.assetType,
        type: post.type,
        caption: post.caption,
        createdAt: post.createdAt,
        shareCount: post.shareCount,
        likeCount: post.likeCount,
        media: postMedias
    });
}

export const newPost = async (req, res, next) => {
    // single image post

    const data = req.validatedData;

    const { type, assetType, caption, postmedia } = data;

    const pageId = req.user._id.toString();

    if (!isJson(postmedia)) {
        const error = new Error(`PostMadia data is invalid!`);
        error.status = 400;
        return next(error);
    }

    const pm = JSON.parse(postmedia);

    if (assetType === 'picture') {
        const mediaAccessTokens = pm.mediaAccessTokens;
        const medias = [];

        for (let i = 0; i < mediaAccessTokens.length; i++) {
            const mediaAccessToken = mediaAccessTokens[i];

            const media = await TmpFiles.findOne({ fileAccesstoken: mediaAccessToken, pageId: pageId }).exec();

            if (!media) {
                const error = new Error(`A postmedia with token ${mediaAccessToken} was not found!`);
                error.status = 404;
                return next(error);
            }

            medias.push(media);
        }


        const post = {
            pageId: pageId,
            assetType: assetType,
            type: type,
            caption: caption,
            createdAt: Date(),
            shareCount: 0,
            likeCount: 0
        }

        const newPost = new Post(post);

        await newPost.save()
            .then(async (savePost) => {

                const postMediaDatas = [];

                for (let i = 0; i < medias.length; i++) {
                    const media = medias[i];

                    const postMediaData = {
                        postId: savePost._id,
                        slideNumber: i,
                        assetUrl: media.path,
                        ext: media.fileExt,
                        createdAt: media.createdAt
                    };

                    postMediaDatas.push(new PostMedia(postMediaData));
                }

                await PostMedia.bulkSave(postMediaDatas)
                    .then(async () => {
                        // TODO: remove tmp files
                        await TmpFiles.deleteMany({ pageId: pageId })
                            .exec()
                            .then(async () => {
                                await Page.findByIdAndUpdate(pageId, { $inc: { postsCount: 1 } }).exec()
                                return res.status(200).json({ success: true });
                            })
                            .catch((reason) => {
                                const error = new Error(reason);
                                error.status = 404;
                                return next(error);
                            })
                    })
                    .catch((reason) => {
                        // TODO: delete post
                        const error = new Error(reason);
                        error.status = 404;
                        return next(error);
                    })
            })
            .catch((reason) => {
                const error = new Error(reason);
                error.status = 404;
                return next(error);
            })
    } else if (assetType === 'video') {
        // TODO: upload video
    } else {
        const error = new Error(`assetType ${assetType} is not supported!`);
        error.status = 500;
        return next(error);
    }
}

export const deletePostByPostId = async (req, res, next) => {
    const pageId = req.user._id.toString();

    const data = req.validatedData;

    const postId = data.postId;

    const isValidId = isValidObjectId(postId);

    if (!isValidId) {
        const err = new Error(`postId is not valid!`);
        err.status = 400;
        return next(err);
    }

    const post = await Post.findById(postId).select('pageId').exec()

    if (!post) {
        const error = new Error(`A post with post id ${postId} was not found`);
        error.status = 404;
        return next(error);
    }

    if (post.pageId.toString() !== pageId) {
        const error = new Error(`You can only delete your posts!`);
        error.status = 401;
        return next(error);
    }

    // delete all post media
    await PostMedia.deleteMany({ postId })
        .exec()
        .then(async () => {
            // delete all post comments
            await PostComments.deleteMany({ postId })
                .exec()
                .then(async () => {
                    await PostComments.deleteMany({ postId })
                        .exec()
                        .then(async () => {
                            await Post.deleteOne({ _id: postId })
                                .exec()
                                .then(async () => {
                                    await Page.findByIdAndUpdate(pageId, { $inc: { postsCount: -1 } })
                                        .exec()
                                        .then(() => {
                                            return res.status(200).json({ success: true, msg: 'post deleted!' });
                                        })
                                        .catch((reason) => {
                                            const error = new Error(reason);
                                            error.status = 500;
                                            return next(error);
                                        })
                                })
                                .catch((reason) => {
                                    const error = new Error(reason);
                                    error.status = 500;
                                    return next(error);
                                })
                        })
                        .catch((reason) => {
                            const error = new Error(reason);
                            error.status = 500;
                            return next(error);
                        })
                })
                .catch((reason) => {
                    const error = new Error(reason);
                    error.status = 500;
                    return next(error);
                })
        })
        .catch((reason) => {
            const error = new Error(reason);
            error.status = 500;
            return next(error);
        })
}