import Page from "../models/page.model.js";
import PageSetting from "../models/pageSetting.model.js";

export const getpageSettings = async (req, res, next) => {
    try {
        const pageId = req.user._id;

        const pagesetting = await Page.findById(pageId).select('pageSetting').populate('pageSetting').exec()
        if (!pagesetting) {
            const err = new Error(`A pagesetting with pageid '${pageId}' was not found!`);
            err.status = 404;
            return next(err);
        }

        return res.status(200).json({ msg: 'success', data: pagesetting.pageSetting });
    } catch (err) {
        console.log(`Error in getpageSettings : ${err}`);
        const error = new Error(`Internal Server Error`)
        error.status = 500;
        return next(error);
    }
}

export const updatepageSettings = async (req, res, next) => {
    try {
        const pageId = req.user._id;

        const data = req.validatedData;

        const { theme, language, country } = data;

        const page = await Page.findById(pageId).select('pageSetting').populate('pageSetting').exec();

        const pagesettingId = page.pageSetting._id.toString();

        const queryResult = await PageSetting.updateOne({ _id: pagesettingId }, { theme, language, country }).exec();

        if (!queryResult.acknowledged) {
            const err = new Error(`Something went wrong updating pageSetting!`);
            err.status = 500;
            return next(err);
        }

        return res.status(200).json({ msg: 'pageSettings updated' });
    } catch (err) {
        console.log(`Error in updatepageSettings : ${err}`);
        const error = new Error(`Internal Server Error`)
        error.status = 500;
        return next(error);
    }
}