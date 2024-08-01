import { Page, PageProfile, PageSetting } from '../mongoose/schemas/page.js';
import { genPassword } from '../utils/passwordsUtil.js';
import { matchedData, validationResult } from 'express-validator';
import mongoose from 'mongoose';

// @desc   Get page
// @route  POST /api/v1.0/@:pageId
// Access
export const getPage = async (req, res, next) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
        return res.status(401).send({ msg: 'pageId invalid' })
    }

    const data = matchedData(req);

    const pageId = data.pageId;

    const isValidId = mongoose.Types.ObjectId.isValid(pageId);

    if (!isValidId) {
        const err = new Error(`pageId is not valid!`);
        err.status = 400;
        return next(err);
    }

    const page = await Page.findById(pageId).populate('pageProfile').populate('pageSetting').exec();
    if (!page) {
        const err = new Error(`A page with id '${pageId}' was not found!`);
        err.status = 404;
        return next(err);
    }

    return res.status(200).json(page);
}

export const newPage = async (req, res, next) => {
    const result = validationResult(req).array({ onlyFirstError: true });
    if (result.length !== 0) {
        return res.status(400).send({ success: false, msg: result[0].msg })
    }

    const data = matchedData(req);

    const { username, fullname, email, password, pagetype } = data;

    const usernameExist = await Page.exists({ username: username }).exec();
    if (usernameExist) {
        const err = new Error(`Username ${username} already exists!`);
        err.status = 400;
        return next(err);
    }

    try {
        // make new pageprofile
        const pageprofile = {
            bio: '',
            website: '',
            birthdate: '',
            // pageId: savePage._id
        }

        const newPageProfile = new PageProfile(pageprofile)

        const savePageProfile = await newPageProfile.save();

        // make new pagesetting
        const pageSetting = {
            theme: 'dark',
            language: 'en',
            country: '',
            // pageId: savePage._id
        }

        const newPageSetting = new PageSetting(pageSetting);

        const savePageSetting = await newPageSetting.save();

        const hashedPass = genPassword(password);

        const newPage = new Page({
            username,
            fullname,
            email,
            password: hashedPass.hash,
            salt: hashedPass.salt,
            pageType: pagetype,
            userSince: Date(),
            lastLogin: Date(),
            active: 1,
            profilePicture: '',
            pageProfile: savePageProfile._id,
            pageSetting: savePageSetting._id
        });
        const savePage = await newPage.save();

        res.status(200).json(savePage);
    } catch (err) {
        console.log(err);
        const error = new Error(`Bad Request!`);
        error.status = 400;
        return next(error);
    }
}

export const updatePageinfo = async (req, res, next) => {
    const result = validationResult(req).array({ onlyFirstError: true });
    if (result.length !== 0) {
        return res.status(400).send({ success: false, msg: result[0].msg })
    }

    const data = matchedData(req);

    const { username, fullname, email, password, pagetype, pageId } = data;

    const isValidId = mongoose.Types.ObjectId.isValid(pageId);

    if (!isValidId) {
        const err = new Error(`pageId is not valid!`);
        err.status = 400;
        return next(err);
    }

    const page = await Page.findById(pageId).exec();
    if (!page) {
        const err = new Error(`A page with id '${pageId}' was not found!`);
        err.status = 404;
        return next(err);
    }

    const usernameExist = await Page.exists({ username: username }).exec();
    if (usernameExist) {
        const err = new Error(`Username ${username} already exists!`);
        err.status = 400;
        return next(err);
    }

    const hashedPass = genPassword(password);

    page.username = username;
    page.fullname = fullname;
    page.email = email;
    page.password = hashedPass.hash;
    page.salt = hashedPass.salt;
    page.pageType = pagetype;

    const savePage = await page.save();

    res.status(200).json(savePage);
}

export const deletePage = async (req, res, next) => {
    const result = validationResult(req).array({ onlyFirstError: true });
    if (result.length !== 0) {
        return res.status(400).send({ success: false, msg: result[0].msg })
    }

    const data = matchedData(req);
    const pageId = data.pageId;

    const isValidId = mongoose.Types.ObjectId.isValid(pageId);

    if (!isValidId) {
        const err = new Error(`pageId is not valid!`);
        err.status = 400;
        return next(err);
    }

    const page = await Page.findById(pageId).exec();
    if (!page) {
        const err = new Error(`A page with id '${pageId}' was not found!`);
        err.status = 404;
        return next(err);
    }

    // check can delete

    // TODO: handle possible error
    await PageProfile.findByIdAndDelete(page.pageProfile).exec();
    await PageSetting.findByIdAndDelete(page.pageSetting).exec();
    await Page.findByIdAndDelete(pageId).exec();

    res.status(200).json({ success: true });
}