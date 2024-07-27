import { samplePageProfiles } from "../helpers/mockuser.js";

export const getPageProfile = (req, res, next) => {
    // TODO: check if page is public -> return bio 
    // if not public -> check if is follower

    const pageId = parseInt(req.params.pageId);
    if (!pageId) {
        const error = new Error(`An Error Accrued While Fetching Page Username!`);
        error.status = 500;
        return next(error);
    }

    const pageprofile = samplePageProfiles.find(pgprofile => pgprofile.pageId === pageId);
    if (!pageprofile) {
        const error = new Error(`Page with pageid '${pageId}' has no pageprofile!`);
        error.status = 500;
        return next(error);
    }

    res.status(200).json({ msg: 'success', pageprofile });
}

export const updatePageProfile = (req, res, next) => {
    const pageId = parseInt(req.params.pageId);
    if (!pageId) {
        const error = new Error(`An Error Accrued While Fetching Page Username!`);
        error.status = 500;
        return next(error);
    }

    const pageprofile = samplePageProfiles.find(pgprofile => pgprofile.pageId === pageId);
    if (!pageprofile) {
        const error = new Error(`Page with pageid '${pageId}' has no pageprofile!`);
        error.status = 500;
        return next(error);
    }

    const { body: { bio, website, birthdate } } = req;

    pageprofile.bio = bio;
    pageprofile.website = website;
    pageprofile.birthdate = birthdate;

    res.status(200).json({ msg: 'pageprofile updated', pageprofile });
}

export const deletePageProfile = (req, res, next) => { 
    const pageId = parseInt(req.params.pageId);
    if (!pageId) {
        const error = new Error(`An Error Accrued While Fetching Page Username!`);
        error.status = 500;
        return next(error);
    }

    const pageprofile = samplePageProfiles.find(pgprofile => pgprofile.pageId === pageId);
    if (!pageprofile) {
        const error = new Error(`Page with pageid '${pageId}' has no pageprofile!`);
        error.status = 500;
        return next(error);
    }

    // check can delete

    samplePageProfiles.splice(samplePageProfiles.indexOf(pageprofile), 1);

    res.status(200).json({ msg: 'pageprofile deleted', samplePageProfiles });
}