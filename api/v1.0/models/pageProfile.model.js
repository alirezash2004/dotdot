import mongoose from "mongoose";

const PageProfileSchema = new mongoose.Schema({
    bio: { type: mongoose.Schema.Types.String },
    website: { type: mongoose.Schema.Types.String },
    birthdate: { type: mongoose.Schema.Types.Date, default: '' },
})

const PageProfile = mongoose.model('PageProfile', PageProfileSchema);

export default PageProfile;