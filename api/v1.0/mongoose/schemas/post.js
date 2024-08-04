import mongoose, { model } from "mongoose";

const PostSchema = new mongoose.Schema({
    pageId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    assetType: {
        type: mongoose.Schema.Types.String,
        required: true,
    },
    type: {
        type: mongoose.Schema.Types.String,
        required: true,
    },
    caption: {
        type: mongoose.Schema.Types.String,
        required: true,
    },
    createdAt: {
        type: mongoose.Schema.Types.Date,
        default: Date.now(),
        required: true,
    },
    shareCount: {
        type: mongoose.Schema.Types.Number,
        default: 0,
        required: true,
    },
    likeCount: {
        type: mongoose.Schema.Types.Number,
        default: 0,
        required: true,
    },
});

export const Post = mongoose.model('Post', PostSchema);



const PostMediaSchema = new mongoose.Schema({
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        required: true,
    },
    slideNumber: {
        type: mongoose.Schema.Types.Number,
        default: 0,
        required: true,
    },
    assetUrl: {
        type: mongoose.Schema.Types.String,
        required: true,
    },
    ext: {
        type: mongoose.Schema.Types.String,
        required: true,
    },
    createdAt: {
        type: mongoose.Schema.Types.Date,
        default: Date.now(),
        required: true,
    },
});

export const PostMedia = mongoose.model('PostMedia', PostMediaSchema);



const PostCommentsSchema = new mongoose.Schema({
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        required: true,
    },
    comment: {
        type: mongoose.Schema.Types.String,
        required: true,
    },
    pageId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Page'
    },
    commentAt: {
        type: mongoose.Schema.Types.Date,
        default: Date.now(),
        required: true,
    },
})

export const PostComments = mongoose.model('PostComments', PostCommentsSchema);



const LikedPostsSchema = new mongoose.Schema({
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        required: true,
    },
    pageId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Page'
    },
    likedAt: {
        type: mongoose.Schema.Types.Date,
        default: Date.now(),
        required: true,
    },
});

export const LikedPosts = new model('LikedPosts', LikedPostsSchema);



const TmpFilesSchema = new mongoose.Schema({
    pageId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Page',
        required: true
    },
    fileAccesstoken: {
        type: mongoose.Schema.Types.String,
        required: true,
    },
    filename: {
        type: mongoose.Schema.Types.String,
        required: true,
    },
    path: {
        type: mongoose.Schema.Types.String,
        required: true,
    },
    fileExt: {
        type: mongoose.Schema.Types.String,
        required: true,
    },
    createdAt: {
        type: mongoose.Schema.Types.Date,
        default: Date.now(),
        required: true,
    },
});

export const TmpFiles = mongoose.model('TmpFiles', TmpFilesSchema);