import mongoose from "mongoose";

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

const PostMedia = mongoose.model('PostMedia', PostMediaSchema);

export default PostMedia;