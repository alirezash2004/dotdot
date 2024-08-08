import mongoose from "mongoose";

const PageSchema = new mongoose.Schema({
    username: { type: mongoose.Schema.Types.String, required: true, unique: true },
    fullname: { type: mongoose.Schema.Types.String, required: true },
    email: { type: mongoose.Schema.Types.String, required: true },
    password: { type: mongoose.Schema.Types.String, required: true },
    salt: { type: mongoose.Schema.Types.String, required: true },
    pageType: { type: mongoose.Schema.Types.String, required: true },
    userSince: { type: mongoose.Schema.Types.Date, default: Date.now() },
    lastLogin: { type: mongoose.Schema.Types.Date, default: Date.now() },
    active: { type: mongoose.Schema.Types.Number },
    profilePicture: { type: mongoose.Schema.Types.String },
    pageProfile: { type: mongoose.Schema.Types.ObjectId, ref: 'PageProfile' },
    pageSetting: { type: mongoose.Schema.Types.ObjectId, ref: 'PageSetting' },
    postsCount: { type: mongoose.Schema.Types.Number, default: 0 },
    followingCount: { type: mongoose.Schema.Types.Number, default: 0 },
    followersCount: { type: mongoose.Schema.Types.Number, default: 0 },
});

const Page = mongoose.model('Page', PageSchema);

export default Page;