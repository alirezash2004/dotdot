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
    }
    // createdAt, updatedAt
}, { timestamps: true });

const LikedPosts = new mongoose.model('LikedPosts', LikedPostsSchema);

export default LikedPosts;