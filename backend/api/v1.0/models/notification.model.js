import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
    from: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Page',
        required: true
    },
    to: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Page',
        required: true
    },
    type: {
        type: mongoose.Schema.Types.String,
        required: true,
        enum: ['like', 'comment', 'follow', 'unFollow', 'followAccept', 'message'],
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        required: false
    },
    read: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

const Notification = mongoose.model('Notification', notificationSchema);

export default Notification;