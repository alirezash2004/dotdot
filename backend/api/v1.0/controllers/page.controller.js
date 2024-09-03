import { genPassword, validatePassword } from '../utils/passwordsUtil.js';

import Page from '../models/page.model.js';
import TmpFiles from '../models/tmpFiles.model.js';

import sharp from 'sharp';
import { __filename, __dirname } from '../../../currentPath.js';
import fs from 'fs';
import path from 'path';

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
            const page = await Page.findById(pageId).exec();
            return res.status(200).json({
                success: true,
                data: {
                    username: page.username,
                    fullName: page.fullName,
                    email: page.email,
                    pageType: page.pageType,
                    pageProfile: page.pageProfile,
                    theme: page.pageSetting.theme,
                    language: page.pageSetting.language,
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

        const doc = await Page.findById(targetPageId).exec()

        return res.status(200).json({
            success: true,
            data: {
                username: doc.username,
                fullName: doc.fullName,
                pageType: doc.pageType,
                pageProfile: {
                    bio: doc.pageProfile.bio,
                    website: doc.pageProfile.website,
                },
                profilePicture: doc.profilePicture,
                postsCount: doc.postsCount,
                followersCount: doc.followersCount,
                followingCount: doc.followingCount,
                _id: doc._id
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

        const { username, fullName, email, password, newpassword, pageType, theme, language, country, bio, website, birthdate } = data;

        const [page, usernameExist] = await Promise.all([
            Page.findById(pageId).exec(),
            Page.exists({ username: username }).exec(),
        ]);

        if (usernameExist && req.user.username !== username) {
            const err = new Error(`Username ${username} already exists!`);
            err.status = 400;
            return next(err);
        }

        // TODO: add old password and check if it's valid | add confirm password

        if (password) {
            if (validatePassword(password || "", page.password, page.salt)) {
                const hashedPass = genPassword(newpassword);

                page.password = hashedPass.hash || page.password;
                page.salt = hashedPass.salt || page.salt;
            } else {
                const error = new Error(`Wrong Password`)
                error.status = 400;
                return next(error);
            }
        } else if (!password && newpassword) {
            const error = new Error(`Current Password Required`)
            error.status = 400;
            return next(error);
        }

        let usernameChange = false;

        if (username && req.user.username !== username) {
            page.username = username;
            usernameChange = true;
        }

        page.fullName = fullName || page.fullName;
        page.email = email || page.email;
        page.pageType = pageType || page.pageType;

        page.pageSetting.theme = theme || page.pageSetting.theme;
        page.pageSetting.language = language || page.pageSetting.language;
        page.pageSetting.country = country || page.pageSetting.country;

        page.pageProfile.bio = bio || page.pageProfile.bio;
        page.pageProfile.website = website || page.pageProfile.website;
        page.pageProfile.birthdate = birthdate || page.pageProfile.birthdate;

        const savePage = await page.save();

        return res.status(200).json({ success: true, usernameChange, username: savePage.username });
    } catch (err) {
        console.log(`Error in updatePageinfo : ${err}`);
        const error = new Error(`Internal Server Error`)
        error.status = 500;
        return next(error);
    }
}

export const updatePageProfile = async (req, res, next) => {
    try {
        const pageId = req.user._id.toString();
        const fileAccesstoken = req.validatedData.fileAccesstoken;

        const page = await Page.findById(pageId).exec();

        const media = await TmpFiles.findOne({ fileAccesstoken: fileAccesstoken, pageId: pageId }).exec();

        if (!media) {
            const error = new Error(`A postmedia with token ${mediaAccessToken} was not found!`);
            error.status = 404;
            return next(error);
        }

        const timestamp = Date.now();
        const f1 = media.filename.split(".")[0].split("-");
        const filename = `${f1[1]}-${f1[2]}`;
        const newProfRef = `profile-${timestamp}-${filename}.webp`;

        fs.access(path.join(__dirname, 'uploads', 'profiles'), (error) => {
            if (error) {
                fs.mkdirSync(path.join(__dirname, 'uploads', 'profiles'));
            }
        });

        sharp.cache(false);

        await sharp(media.path)
            .resize({
                width: 400,
                height: 400,
                fit: sharp.fit.cover,
                position: sharp.strategy.entropy
            })
            .webp({ quality: 20 })
            .normalize()
            .toFile(path.join(__dirname, 'uploads', 'profiles', newProfRef))

        const flUrl = req.protocol + "://" + req.get("host") + "/profiles/" + newProfRef;

        // delete old profile pic
        const oldProfRef = page.profilePicture.split('/')[4];
        if (!!oldProfRef) {
            fs.unlinkSync(path.join(__dirname, 'uploads', 'profiles', oldProfRef));
        }

        // delete uncropped pic
        fs.unlinkSync(media.path);

        page.profilePicture = flUrl;

        const [savePage, _] = await Promise.all([
            page.save(),
            TmpFiles.findByIdAndDelete(media._id)
        ])

        return res.status(200).json({ success: true, username: savePage.profilePicture });
    } catch (err) {
        console.log(`Error in updatePageProfile : ${err}`);
        const error = new Error(`Internal Server Error`)
        error.status = 500;
        return next(error);
    }
}

export const deletePage = async (req, res, next) => {
    try {

        const pageId = req.user._id;

        // TODO: delete posts
        await Page.findByIdAndDelete(pageId).exec();

        return res.status(200).json({ success: true });
    } catch (err) {
        console.log(`Error in updatePageinfo : ${err}`);
        const error = new Error(`Internal Server Error`)
        error.status = 500;
        return next(error);
    }
}