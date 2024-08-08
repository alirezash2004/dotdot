import mongoose from "mongoose";

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
    // createdAt, updatedAt
}, { timestamps: true })

const PostComments = mongoose.model('PostComments', PostCommentsSchema);

export default PostComments;