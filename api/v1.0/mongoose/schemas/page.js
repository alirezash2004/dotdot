import mongoose, { Mongoose } from "mongoose";

const PageSchema = new mongoose.Schema({
    username: {
        type: mongoose.Schema.Types.String,
        required: true,
        unique: true,
    },
    fullname: {
        type: mongoose.Schema.Types.String,
        required: true,
    },
    email: {
        type: mongoose.Schema.Types.String,
        required: true,
    },
    password: {
        type: mongoose.Schema.Types.String,
        required: true,
    },
    salt: {
        type: mongoose.Schema.Types.String,
        required: true,
    },
    pageType: {
        type: mongoose.Schema.Types.String,
        required: true,
    },
    userSince: { type: mongoose.Schema.Types.Date, default: Date.now },
    lastLogin: { type: mongoose.Schema.Types.Date, default: Date.now },
    active: mongoose.Schema.Types.Number,
    profilePicture: mongoose.Schema.Types.String,
    pageProfile: { type: mongoose.Schema.Types.ObjectId, ref: 'PageProfile' },
    pageSetting: { type: mongoose.Schema.Types.ObjectId, ref: 'PageSetting' },
    postsCount: { type: mongoose.Schema.Types.Number, default: 0 },
    followingCount: { type: mongoose.Schema.Types.Number, default: 0 },
    followersCount: { type: mongoose.Schema.Types.Number, default: 0 },
});

export const Page = mongoose.model('Page', PageSchema);



const PageProfileSchema = new mongoose.Schema({
    bio: mongoose.Schema.Types.String,
    website: mongoose.Schema.Types.String,
    birthdate: { type: mongoose.Schema.Types.Date, default: '' },
})

export const PageProfile = mongoose.model('PageProfile', PageProfileSchema);



const PageSettingSchema = new mongoose.Schema({
    theme: { type: mongoose.Schema.Types.String, default: 'dark' },
    language: { type: mongoose.Schema.Types.String, default: 'en' },
    country: { type: mongoose.Schema.Types.String, default: '' },
})

export const PageSetting = mongoose.model('PageSetting', PageSettingSchema);
