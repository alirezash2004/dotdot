import { posts, postMedia, postComments } from '../helpers/mockdata.js';

// @desc   Get signle post
// @route  GET /api/v1.0/posts/:postId
// Access
export const getPostByPostId = (req, res, next) => {
    const postId = parseInt(req.params.postId);
    const post = posts.find((post) => post.id === postId);

    if (!post) {
        const error = new Error(`A post with post id ${postId} was not found`);
        error.status = 404;
        return next(error);
    }

    let CurrentpostMedia;

    if (post.type === 'single') {
        CurrentpostMedia = postMedia.find(postMedia => postMedia.postId === postId);
        CurrentpostMedia = {
            type: CurrentpostMedia.type,
            assetUrl: CurrentpostMedia.assetUrl
        }
    } else if (post.type === 'multiple') {
        CurrentpostMedia = postMedia.filter(postMedia => postMedia.postId === postId);
        for (let i = 0; i < CurrentpostMedia.length; i++) {
            CurrentpostMedia[i] = {
                slideNumber: CurrentpostMedia[i].slideNumber,
                type: CurrentpostMedia[i].type,
                assetUrl: CurrentpostMedia[i].assetUrl
            }
        }
    }

    if (!CurrentpostMedia) {
        const error = new Error(`A post with post id ${postId} does not have the media property!`);
        error.status = 500;
        return next(error);
    }

    post.media = CurrentpostMedia;

    const returnComments = Boolean(req.query.comments === 'true');
    if (!returnComments) {
        post.comments = [];
        return res.status(200).json(post);
    }

    const currentPostComments = postComments.filter((comment) => comment.postId === postId);
    post.comments = currentPostComments;

    res.status(200).json(post);
}

export const newPost = (req, res, next) => {
    // single image post
    const { body: { pageId, type, assetType, caption, postMedia } } = req;

    const post = {
        id: posts[posts.length - 1].id + 1,
        pageId: parseInt(pageId),
        assetType: assetType,
        type: type,
        caption: caption,
        createdAt: Date(),
        shareCount: 0,
        LikeCount: 0
    }

    postMedia = JSON.parse(postMedia);

    if (assetType === 'picture') {
        
    } else if (assetType === 'video') {
        // TODO: upload video
    } else {
        const error = new Error(`assetType ${assetType} is not supported!`);
        error.status = 500;
        return next(error);
    }
}