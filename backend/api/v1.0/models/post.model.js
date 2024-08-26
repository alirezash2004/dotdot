import mongoose from "mongoose";

const PostSchema = new mongoose.Schema({
    page: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Page',
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
    assets: [
        {
            url: {
                type: mongoose.Schema.Types.String,
            }
        }
    ],
    shares: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Page',
        }
    ],
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Page',
        }
    ],
    comments: [
        {
            page: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Page',
                required: true
            },
            text: {
                type: mongoose.Schema.Types.String,
                required: true
            },
            createdAt: {
                type: mongoose.Schema.Types.Date,
                required: true,
            }
        }
    ],
    // createdAt, updatedAt
}, { timestamps: true });

const Post = mongoose.model('Post', PostSchema);

export default Post;