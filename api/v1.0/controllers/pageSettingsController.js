import { matchedData, validationResult } from "express-validator";
import { samplepageSettings } from "../helpers/mockuser.js";

export const getpageSettings = (req, res, next) => {
    // TODO: check if page is public -> return bio 
    // if not public -> check if is follower

    const result = validationResult(req).array({ onlyFirstError: true });
    if (result.length !== 0) {
        return res.status(400).send({ msg: result[0].msg });
    }

    const data = matchedData(req);

    const pageId = parseInt(data.pageId);
    if (!pageId) {
        const error = new Error(`An Error Accrued While Fetching Page Username!`);
        error.status = 500;
        return next(error);
    }

    const pageSettings = samplepageSettings.find(pgprofile => pgprofile.pageId === pageId);
    if (!pageSettings) {
        const error = new Error(`Page with pageid '${pageId}' has no pageSettings!`);
        error.status = 500;
        return next(error);
    }

    res.status(200).json({ msg: 'success', pageSettings });
}

export const updatepageSettings = (req, res, next) => {
    const result = validationResult(req).array({ onlyFirstError: true });
    if (result.length !== 0) {
        return res.status(400).send({ msg: result[0].msg });
    }

    const data = matchedData(req);

    const pageId = parseInt(data.pageId);
    if (!pageId) {
        const error = new Error(`An Error Accrued While Fetching Page Username!`);
        error.status = 500;
        return next(error);
    }

    const pageSettings = samplepageSettings.find(pageSettings => pageSettings.pageId === pageId);
    if (!pageSettings) {
        const error = new Error(`Page with pageid '${pageId}' has no pageSettings!`);
        error.status = 500;
        return next(error);
    }

    const { body: { theme, language, country } } = req;

    pageSettings.theme = theme;
    pageSettings.language = language;
    pageSettings.country = country;

    res.status(200).json({ msg: 'pageSettings updated', pageSettings });
}

export const deletepageSettings = (req, res, next) => { 
    const result = validationResult(req).array({ onlyFirstError: true });
    if (result.length !== 0) {
        return res.status(400).send({ msg: result[0].msg });
    }

    const data = matchedData(req);

    const pageId = parseInt(data.pageId);
    if (!pageId) {
        const error = new Error(`An Error Accrued While Fetching Page Username!`);
        error.status = 500;
        return next(error);
    }

    const pageSettings = samplepageSettings.find(pgprofile => pgprofile.pageId === pageId);
    if (!pageSettings) {
        const error = new Error(`Page with pageid '${pageId}' has no pageSettings!`);
        error.status = 500;
        return next(error);
    }

    // check can delete

    samplepageSettings.splice(samplepageSettings.indexOf(pageSettings), 1);

    res.status(200).json({ msg: 'pageSettings deleted', samplepageSettings });
}