import { genPassword } from '../utils/passwordsUtil.js';

import Page from '../models/page.model.js';
import PageProfile from '../models/pageProfile.model.js';

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
            const page = await Page.findById(pageId).populate('pageProfile').exec();
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
        const pageId = req.user._id.toString();
        const data = req.validatedData;

        const { username, fullname, email, password, pageType, pageSetting } = data;

        const [page, usernameExist] = await Promise.all([
            await Page.findById(pageId).exec(),
            await Page.exists({ username: username }).exec(),
        ]);

        if (usernameExist) {
            const err = new Error(`Username ${username} already exists!`);
            err.status = 400;
            return next(err);
        }

        // TODO: add old password and check if it's valid | add confirm password

        const hashedPass = genPassword(password);

        page.username = username || page.username;
        page.fullname = fullname || page.fullname;
        page.email = email || page.email;
        page.password = hashedPass.hash || page.password;
        page.salt = hashedPass.salt || page.salt;
        page.pageType = pageType || page.pageType;
        page.pageSetting.theme = pageSetting.theme || page.pageSetting.theme;
        page.pageSetting.language = pageSetting.language || page.pageSetting.language;
        page.pageSetting.country = pageSetting.country || page.pageSetting.country;

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