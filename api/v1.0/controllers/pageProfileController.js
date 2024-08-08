import Page from "../models/page.model.js";
import PageProfile from "../models/pageProfile.model.js";

export const getPageProfile = async (req, res, next) => {
    const data = req.validatedData;

    const pageId = req.user._id;

    const targetPageUsername = data.username;

    // check if getting itself
    if (targetPageUsername === req.user.username) {
        const pageprofile = await Page.findById(pageId).select('pageProfile').populate('pageProfile').exec();
        return res.status(200).json({
            success: true,
            data: {
                bio: pageprofile.pageProfile.bio,
                website: pageprofile.pageProfile.website,
                birthdate: pageprofile.pageProfile.birthdate,
            }
        });
    }

    const pageprofile = await Page.findOne({ username: targetPageUsername }).select('pageProfile').populate('pageProfile').exec()

    if (!pageprofile) {
        const err = new Error(`A pageprofile for page with username '${targetPageUsername}' was not found!`);
        err.status = 404;
        return next(err);
    }

    return res.status(200).json({
        success: true,
        data: {
            bio: pageprofile.pageProfile.bio,
            website: pageprofile.pageProfile.website,
        }
    });
}

export const updatePageProfile = async (req, res, next) => {    
    const pageId = req.user._id;

    const { bio, website, birthdate } = data;

    const page = await Page.findById(pageId).select('pageProfile').populate('pageProfile').exec();

    const pageprofileId = page.pageProfile._id.toString();

    const queryResult = await PageProfile.updateOne({ _id: pageprofileId }, { bio, website, birthdate });

    if (!queryResult.acknowledged) {
        const err = new Error(`Something went wrong updating pageprofile!`);
        err.status = 500;
        return next(err);
    }

    res.status(200).json({ msg: 'pageprofile updated' });
}