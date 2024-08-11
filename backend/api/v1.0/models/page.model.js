import mongoose from "mongoose";

const PageSchema = new mongoose.Schema({
    username: { type: mongoose.Schema.Types.String, required: true, unique: true },
    fullname: { type: mongoose.Schema.Types.String, required: true },
    email: { type: mongoose.Schema.Types.String, required: true },
    password: { type: mongoose.Schema.Types.String, required: true },
    salt: { type: mongoose.Schema.Types.String, required: true },
    pageType: { type: mongoose.Schema.Types.String, required: true },
    lastLogin: { type: mongoose.Schema.Types.Date, default: Date.now() },
    active: { type: mongoose.Schema.Types.Number },
    profilePicture: { type: mongoose.Schema.Types.String },
    pageProfile: {
        bio: { type: mongoose.Schema.Types.String, default: '' },
        website: { type: mongoose.Schema.Types.String, default: '' },
        birthdate: { type: mongoose.Schema.Types.Date, default: '' },
    },
    pageSetting: {
        theme: { type: mongoose.Schema.Types.String, default: 'dark' },
        language: { type: mongoose.Schema.Types.String, default: 'en' },
        country: { type: mongoose.Schema.Types.String, default: '' },
    },
    postsCount: { type: mongoose.Schema.Types.Number, default: 0 },
    followingCount: { type: mongoose.Schema.Types.Number, default: 0 },
    followersCount: { type: mongoose.Schema.Types.Number, default: 0 },
    likedPosts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Post',
            default: [],
        }
    ]
    // createdAt, updatedAt
}, { timestamps: true });

const Page = mongoose.model('Page', PageSchema);

export default Page;