import Page from '../models/page.model.js';
import PageProfile from '../models/pageProfile.model.js';
import PageSetting from '../models/pageSetting.model.js';
import { genPassword } from '../utils/passwordsUtil.js';
import { isValidObjectId } from 'mongoose';

// @desc   Get page
// @route  POST /api/v1.0/@:pageId
// Access
export const getPage = async (req, res, next) => {
    try {
        const data = req.validatedData;

        const pageId = req.user._id;

        const targetPageUsername = data.username;

        // check if getting itself
        if (targetPageUsername === req.user.username) {
            const page = await Page.findById(pageId).populate('pageProfile').populate('pageSetting').exec();
            return res.status(200).json({
                success: true,
                data: {
                    username: page.username,
                    fullname: page.fullname,
                    email: page.email,
                    pageType: page.pageType,
                    bio: page.pageProfile.bio,
                    website: page.pageProfile.website,
                    birthdate: page.pageProfile.birthdate,
                    theme: page.pageSetting.theme,
                    theme: page.pageSetting.language,
                    profilePicture: page.profilePicture,
                    postsCount: page.postsCount,
                    followersCount: page.followersCount,
                    followingCount: page.followingCount,
                }
            });
        }

        const page = await Page.exists({ username: targetPageUsername }).exec();

        if (!page) {
            const err = new Error(`A page with username '${targetPageUsername}' was not found!`);
            err.status = 404;
            return next(err);
        }

        const targetPageId = page._id;

        const doc = await Page.findById(targetPageId).populate('pageProfile').exec()

        return res.status(200).json({
            success: true,
            data: {
                username: doc.username,
                fullname: doc.fullname,
                pageType: doc.pageType,
                bio: doc.pageProfile.bio,
                website: doc.pageProfile.website,
                profilePicture: doc.profilePicture,
                postsCount: doc.postsCount,
                followersCount: doc.followersCount,
                followingCount: doc.followingCount,
            }
        });
    } catch (err) {
        console.log(`Error in getPage : ${err}`);
        const error = new Error(`Internal Server Error`)
        error.status = 500;
        return next(error);
    }
}

export const updatePageinfo = async (req, res, next) => {
    try {
        const data = req.validatedData;

        const { username, fullname, email, password, pagetype, pageId } = data;

        const isValidId = isValidObjectId(pageId);

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

        return res.status(200).json(savePage);
    } catch (err) {
        console.log(`Error in updatePageinfo : ${err}`);
        const error = new Error(`Internal Server Error`)
        error.status = 500;
        return next(error);
    }
}

export const deletePage = async (req, res, next) => {
    try {

        const pageId = req.user._id;
        const page = await Page.findById(pageId).exec();

        // TODO: delete posts
        await Promise.all([
            PageProfile.findByIdAndDelete(page.pageProfile).exec(),
            PageSetting.findByIdAndDelete(page.pageSetting).exec(),
            Page.findByIdAndDelete(pageId).exec(),
        ])

        return res.status(200).json({ success: true });
    } catch (err) {
        console.log(`Error in updatePageinfo : ${err}`);
        const error = new Error(`Internal Server Error`)
        error.status = 500;
        return next(error);
    }
}