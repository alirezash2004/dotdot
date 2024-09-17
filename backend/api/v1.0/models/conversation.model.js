import mongoose from 'mongoose';

const coversationSchema = new mongoose.Schema({
    participants: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Page',
        }
    ],
    messages: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Message',
            default: [],
        }
    ],
    // createdAt, updatedAt
}, { timestamps: true });

const Conversation = mongoose.model('Conversation', coversationSchema);

export default Conversation;