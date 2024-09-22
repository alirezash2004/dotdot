import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
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
    message: {
        text: {
            type: mongoose.Schema.Types.String,
        },
        post: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Post',
        },
    },
    read: {
        type: mongoose.Schema.Types.Boolean,
        required: true,
        default: false
    }
}, { timestamps: true });

const Message = mongoose.model("Message", messageSchema);

export default Message;