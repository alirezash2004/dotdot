import mongoose from 'mongoose';

const SavedpostSchema = new mongoose.Schema({
    pageId: { type: mongoose.Schema.Types.ObjectId, ref: 'Page' },
    postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
}, { timestamps: true })

const Savedpost = mongoose.model('Savedpost', SavedpostSchema);

export default Savedpost;