import mongoose from "mongoose";

const TmpFilesSchema = new mongoose.Schema({
    pageId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Page',
        required: true
    },
    fileAccesstoken: {
        type: mongoose.Schema.Types.String,
        required: true,
    },
    filename: {
        type: mongoose.Schema.Types.String,
        required: true,
    },
    path: {
        type: mongoose.Schema.Types.String,
        required: true,
    },
    fileExt: {
        type: mongoose.Schema.Types.String,
        required: true,
    },
    // createdAt, updatedAt
}, { timestamps: true });

const TmpFiles = mongoose.model('TmpFiles', TmpFilesSchema);

export default TmpFiles;