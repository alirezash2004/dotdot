import { samplePages, samplePageProfiles, samplepageSettings } from '../helpers/mockuser.js';
import { genPassword } from '../utils/passwordsUtil.js';
import { getFollowingsCount, getFollowersCount } from './followingRelationshipsController.js';
import { matchedData, validationResult } from 'express-validator';

// @desc   Get page
// @route  POST /api/v1.0/@:pageId
// Access
export const getPage = (req, res, next) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
        return res.status(401).send({ msg: 'pageId invalid' })
    }

    const data = matchedData(req);

    const pageId = parseInt(data.pageId);
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
    const result = validationResult(req).array({ onlyFirstError: true });
    if (result.length !== 0) {
        return res.status(400).send({ success: false, msg: result[0].msg })
    }

    const data = matchedData(req);

    const { username, fullname, email, password, pagetype } = data;

    // TODO: check if username is unique

    const hashedPass = genPassword(password);

    // make new page
    const page = {
        id: samplePages[samplePages.length - 1].id + 1,
        username: username,
        fullname: fullname,
        email: email,
        password: hashedPass.hash,
        salt: hashedPass.salt,
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
    const result = validationResult(req).array({ onlyFirstError: true });
    if (result.length !== 0) {
        return res.status(400).send({ success: false, msg: result[0].msg })
    }

    const data = matchedData(req);
    console.log(data);

    const { username, fullname, email, password, pagetype, pageId } = data;

    // TODO: check if username is unique
    const pageIdInt = parseInt(pageId);
    if (!pageIdInt) {
        const error = new Error(`An Error Accrued While Fetching Page id!`);
        error.status = 500;
        return next(error);
    }

    const page = samplePages.find((page) => page.id === pageIdInt);
    if (!page) {
        const error = new Error(`A page with id '${pageIdInt}' was not found!`);
        error.status = 404;
        return next(error);
    }

    const hashedPass = genPassword(password)

    page.username = username;
    page.fullname = fullname;
    page.email = email;
    page.password = hashedPass.hash;
    page.salt = hashedPass.salt;
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