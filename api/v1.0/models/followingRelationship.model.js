import mongoose from "mongoose";

const FollowingRelationshipSchema = new mongoose.Schema({
    pageId: { type: mongoose.Schema.Types.ObjectId, ref: 'Page' },
    followedPageId: { type: mongoose.Schema.Types.ObjectId, ref: 'Page' },
    followedAt: { type: mongoose.Schema.Types.Date, default: Date.now() },
})

const FollowingRelationship = mongoose.model('FollowingRelationship', FollowingRelationshipSchema);

export default FollowingRelationship;