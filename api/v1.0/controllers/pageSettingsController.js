import { matchedData, validationResult } from "express-validator";
import { samplepageSettings } from "../helpers/mockuser.js";
import { Page, PageSetting } from "../mongoose/schemas/page.js";
import mongoose from "mongoose";

export const getpageSettings = async (req, res, next) => {
    // TODO: check if page is public -> return bio 
    // if not public -> check if is follower

    const result = validationResult(req).array({ onlyFirstError: true });
    if (result.length !== 0) {
        return res.status(400).send({ msg: result[0].msg });
    }

    const data = matchedData(req);

    const pageId = data.pageId;

    const isValidId = mongoose.Types.ObjectId.isValid(pageId);

    if (!isValidId) {
        const err = new Error(`pageId is not valid!`);
        err.status = 400;
        return next(err);
    }

    const pagesetting = await Page.findById(pageId).select('pageSetting').populate('pageSetting').exec()
    if (!pagesetting) {
        const err = new Error(`A pagesetting with pageid '${pageId}' was not found!`);
        err.status = 404;
        return next(err);
    }

    res.status(200).json({ msg: 'success', pageSetting: pagesetting.pageSetting });
}

export const updatepageSettings = async (req, res, next) => {
    const result = validationResult(req).array({ onlyFirstError: true });
    if (result.length !== 0) {
        return res.status(400).send({ msg: result[0].msg });
    }

    const data = matchedData(req);

    const pageId = data.pageId;

    const isValidId = mongoose.Types.ObjectId.isValid(pageId);

    if (!isValidId) {
        const err = new Error(`pageId is not valid!`);
        err.status = 400;
        return next(err);
    }

    const { theme, language, country } = data;

    const page = await Page.findById(pageId).select('pageSetting').populate('pageSetting').exec();
    if (!page) {
        const err = new Error(`A pagesetting with pageid '${pageId}' was not found!`);
        err.status = 404;
        return next(err);
    }

    const pagesettingId = page.pageSetting._id.toString();

    const queryResult = await PageSetting.updateOne({ _id: pagesettingId }, { theme, language, country });

    if (!queryResult.acknowledged) {
        const err = new Error(`Something went wrong updating pageSetting!`);
        err.status = 500;
        return next(err);
    }

    res.status(200).json({ msg: 'pageSettings updated' });
}