import { Page, PageProfile } from "../mongoose/schemas/page.js";
import { isValidObjectId } from 'mongoose';

export const getPageProfile = async (req, res, next) => {
    // TODO: check if page is public -> return bio 
    // if not public -> check if is follower

    const data = req.validatedData;

    const pageId = data.pageId;

    const isValidId = isValidObjectId(pageId);

    if (!isValidId) {
        const err = new Error(`pageId is not valid!`);
        err.status = 400;
        return next(err);
    }

    const pageprofile = await Page.findById(pageId).select('pageProfile').populate('pageProfile').exec()
    if (!pageprofile) {
        const err = new Error(`A pageprofile with pageid '${pageId}' was not found!`);
        err.status = 404;
        return next(err);
    }

    res.status(200).json({ msg: 'success', pageProfile: pageprofile.pageProfile });
}

export const updatePageProfile = async (req, res, next) => {
    const data = req.validatedData;

    const pageId = data.pageId;

    const isValidId = isValidObjectId(pageId);

    if (!isValidId) {
        const err = new Error(`pageId is not valid!`);
        err.status = 400;
        return next(err);
    }

    const { bio, website, birthdate } = data;

    const page = await Page.findById(pageId).select('pageProfile').populate('pageProfile').exec();
    if (!page) {
        const err = new Error(`A pageprofile with pageid '${pageId}' was not found!`);
        err.status = 404;
        return next(err);
    }

    const pageprofileId = page.pageProfile._id.toString();

    const queryResult = await PageProfile.updateOne({ _id: pageprofileId }, { bio, website, birthdate });

    if (!queryResult.acknowledged) {
        const err = new Error(`Something went wrong updating pageprofile!`);
        err.status = 500;
        return next(err);
    }

    res.status(200).json({ msg: 'pageprofile updated' });
}