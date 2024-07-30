import { matchedData, validationResult } from 'express-validator';
import { posts, postMedia, postComments } from '../helpers/mockdata.js';
import { tmpFiles } from '../helpers/mockfilemanager.js';
import { isJson } from '../utils/checkIsJson.js';

// @desc   Get signle post
// @route  GET /api/v1.0/posts/:postId
// Access
export const getPostByPostId = (req, res, next) => {
    const result = validationResult(req).array({ onlyFirstError: true });
    if (result.length !== 0) {
        return res.status(400).send({ msg: result[0].msg });
    }

    const data = matchedData(req);
    const postId = parseInt(data.postId);
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
    // TODO: validate all inputs
    // single image post

    const result = validationResult(req).array({ onlyFirstError: true });
    if (result.length !== 0) {
        return res.status(400).send({ success: false, msg: result[0].msg })
    }

    const data = matchedData(req);
    console.log(data);

    const { pageId, type, assetType, caption, postmedia } = data;

    const postId = posts[posts.length - 1].id + 1;

    const post = {
        id: postId,
        pageId: parseInt(pageId),
        assetType: assetType,
        type: type,
        caption: caption,
        createdAt: Date(),
        shareCount: 0,
        LikeCount: 0
    }

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

            const media = tmpFiles.find(media => media.fileAccesstoken === mediaAccessToken);

            if (!media) {
                const error = new Error(`A postmedia with token ${mediaAccessToken} was not found!`);
                error.status = 404;
                return next(error);
            }

            medias.push(media);
        }


        for (let i = 0; i < medias.length; i++) {
            const media = medias[i];

            postMedia.push({
                id: postMedia[postMedia.length - 1] + 1,
                postId: postId,
                slideNumber: i,
                assetUrl: media.path,
                ext: media.fileExt,
                createdTimestamp: media.createdTimestamp
            })
        }

        posts.push(post);

        console.log(postMedia);
        res.status(200).json(post);

    } else if (assetType === 'video') {
        // TODO: upload video
    } else {
        const error = new Error(`assetType ${assetType} is not supported!`);
        error.status = 500;
        return next(error);
    }
}

export const deletePostByPostId = (req, res, next) => {
    const result = validationResult(req).array({ onlyFirstError: true });
    if (result.length !== 0) {
        return res.status(400).send({ msg: result[0].msg });
    }

    const data = matchedData(req);

    const postId = parseInt(data.postId);
    const post = posts.find((post) => post.id === postId);

    if (!post) {
        const error = new Error(`A post with post id ${postId} was not found`);
        error.status = 404;
        return next(error);
    }

    // delete all post media
    const CurrentpostMedias = postMedia.filter(postMedia => postMedia.postId === postId);
    for (let i = 0; i < CurrentpostMedias.length; i++) {
        const CurrentpostMedia = CurrentpostMedias[i];
        postMedia.splice(postMedia.indexOf(CurrentpostMedia), 1);
    }

    // delete all post comments
    const currentPostComments = postComments.filter((comment) => comment.postId === postId);
    for (let i = 0; i < currentPostComments.length; i++) {
        const currentPostComment = currentPostComments[i];
        postComments.splice(postComments.indexOf(currentPostComment), 1);
    }

    // delete post
    posts.splice(posts.indexOf(post), 1);

    res.status(200).json({ msg: 'post deleted!' });
}