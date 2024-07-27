import { samplepageSettings } from "../helpers/mockuser.js";

export const getpageSettings = (req, res, next) => {
    // TODO: check if page is public -> return bio 
    // if not public -> check if is follower

    const pageId = parseInt(req.params.pageId);
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
    const pageId = parseInt(req.params.pageId);
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

    const { body: { bio, website, birthdate } } = req;

    pageSettings.bio = bio;
    pageSettings.website = website;
    pageSettings.birthdate = birthdate;

    res.status(200).json({ msg: 'pageSettings updated', pageSettings });
}

export const deletepageSettings = (req, res, next) => { 
    const pageId = parseInt(req.params.pageId);
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

    samplepageSettingss.splice(samplepageSettings.indexOf(pageSettings), 1);

    res.status(200).json({ msg: 'pageSettings deleted', samplepageSettingss });
}