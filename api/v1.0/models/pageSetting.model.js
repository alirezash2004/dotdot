import mongoose from "mongoose";

const PageSettingSchema = new mongoose.Schema({
    theme: { type: mongoose.Schema.Types.String, default: 'dark' },
    language: { type: mongoose.Schema.Types.String, default: 'en' },
    country: { type: mongoose.Schema.Types.String, default: '' },
})

const PageSetting = mongoose.model('PageSetting', PageSettingSchema);

export default PageSetting;