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
    text: {
        type: mongoose.Schema.Types.String,
        required: true
    },
    read: {
        type: mongoose.Schema.Types.Boolean,
        required: true,
        default: false
    }
}, { timestamps: true });

const Message = mongoose.model("Message", messageSchema);

export default Message;