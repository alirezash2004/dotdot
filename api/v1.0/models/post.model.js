import mongoose from "mongoose";

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
    // createdAt, updatedAt
}, { timestamps: true });

const Post = mongoose.model('Post', PostSchema);

export default Post;