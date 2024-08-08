import mongoose from "mongoose";

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

const LikedPosts = new mongoose.model('LikedPosts', LikedPostsSchema);

export default LikedPosts;