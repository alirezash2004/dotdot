import { Page, PageSetting } from "../mongoose/schemas/page.js";
import { isValidObjectId } from 'mongoose';

export const getpageSettings = async (req, res, next) => {
    const pageId = req.user._id;

    const pagesetting = await Page.findById(pageId).select('pageSetting').populate('pageSetting').exec()
    if (!pagesetting) {
        const err = new Error(`A pagesetting with pageid '${pageId}' was not found!`);
        err.status = 404;
        return next(err);
    }

    res.status(200).json({ msg: 'success', data: pagesetting.pageSetting });
}

export const updatepageSettings = async (req, res, next) => {
    const pageId = req.user._id;

    const { theme, language, country } = data;

    const page = await Page.findById(pageId).select('pageSetting').populate('pageSetting').exec();

    const pagesettingId = page.pageSetting._id.toString();

    const queryResult = await PageSetting.updateOne({ _id: pagesettingId }, { theme, language, country });

    if (!queryResult.acknowledged) {
        const err = new Error(`Something went wrong updating pageSetting!`);
        err.status = 500;
        return next(err);
    }

    res.status(200).json({ msg: 'pageSettings updated' });
}