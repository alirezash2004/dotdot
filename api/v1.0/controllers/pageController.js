import { samplePages, samplePageProfiles, samplepageSettings } from '../helpers/mockuser.js';
import { getFollowingsCount, getFollowersCount } from './followingRelationshipsController.js';

// @desc   Get page
// @route  POST /api/v1.0/@:pageId
// Access
export const getPage = (req, res, next) => {
    const pageId = parseInt(req.params.pageId);
    if (!pageId) {
        const error = new Error(`An Error Accrued While Fetching Page Id!`);
        error.status = 500;
        return next(error);
    }

    const page = samplePages.find((page) => page.id === pageId);
    if (!page) {
        const error = new Error(`A page with id '${pageId}' was not found!`);
        error.status = 404;
        return next(error);
    }

    // get pageprofile data
    const pageProfile = samplePageProfiles.find(pgprofile => pgprofile.pageId === pageId);
    if (!pageProfile) {
        const error = new Error(`Page with pageid '${pageId}' has no pageprofile!`);
        error.status = 500;
        return next(error);
    }

    page.pageProfile = pageProfile;

    const pageSetting = samplepageSettings.find(pgSetting => pgSetting.pageId === pageId);
    if (!pageSetting) {
        const error = new Error(`Page with pageid '${pageId}' has no pagesetting!`);
        error.status = 500;
        return next(error);
    }

    page.pageSetting = pageSetting;

    // get posts count
    const postsCount = 12;
    page.postsCount = postsCount;

    // get following count
    const followingCount = getFollowingsCount(req);
    page.followingCount = followingCount;

    // get follower count
    const followersCount = getFollowersCount(req);
    page.followersCount = followersCount;

    res.status(200).json(page);
}

export const newPage = (req, res, next) => {
    const { body: { username, fullname, email, password, pagetype } } = req;

    // validate input -- exist - notempty

    // make new page
    const page = {
        id: samplePages[samplePages.length - 1].id + 1,
        username: username,
        fullname: fullname,
        email: email,
        password: password,
        pagetype: pagetype,
        userSince: Date(),
        lastLogin: Date(),
        active: 1,
        profilePicture: ''
    };

    samplePages.push(page);

    // make new pageprofile
    const pageprofile = {
        bio: '',
        website: '',
        birthdate: '',
        pageId: page.id
    }

    samplePageProfiles.push(pageprofile);

    // make new pagesetting
    const pageSetting = {
        theme: 'dark',
        language: 'en',
        country: '',
        pageId: page.id
    }

    samplepageSettings.push(pageSetting);

    res.status(200).json(samplePages);
}

export const updatePageinfo = (req, res, next) => {
    const { params, body: { username, fullname, email, password, pagetype } } = req;
    const pageId = parseInt(params.pageId);
    if (!pageId) {
        const error = new Error(`An Error Accrued While Fetching Page id!`);
        error.status = 500;
        return next(error);
    }

    const page = samplePages.find((page) => page.id === pageId);
    if (!page) {
        const error = new Error(`A page with id '${pageId}' was not found!`);
        error.status = 404;
        return next(error);
    }

    // validate input -- exist - notempty

    page.username = username;
    page.fullname = fullname;
    page.email = email;
    page.password = password;
    page.pageType = pagetype;

    samplePages[samplePages.indexOf(page)] = page;

    res.status(200).json(samplePages);
}

export const deletePage = (req, res, next) => {
    const { params } = req;
    const pageId = parseInt(params.pageId);
    if (!pageId) {
        const error = new Error(`An Error Accrued While Fetching Page id!`);
        error.status = 500;
        return next(error);
    }

    const page = samplePages.find((page) => page.id === pageId);
    if (!page) {
        const error = new Error(`A page with id '${pageId}' was not found!`);
        error.status = 404;
        return next(error);
    }

    // check can delete

    samplePages.splice(samplePages.indexOf(page), 1);

    res.status(200).json(samplePages);
}