import generateTokenAndSetCookie from '../utils/jwtUtil.js';
import { genPassword, validatePassword } from '../utils/passwordsUtil.js';

import Page from '../models/page.model.js';
import PageProfile from '../models/pageProfile.model.js';

export const signup = async (req, res, next) => {
    try {
        const data = req.validatedData;

        const { username, fullname, email, password, pageType } = data;

        const usernameExist = await Page.exists({ username: username }).exec();
        if (usernameExist) {
            const err = new Error(`Username ${username} already exists!`);
            err.status = 400;
            return next(err);
        }

        // make new pageprofile
        const pageprofile = {
            bio: '',
            website: '',
            birthdate: '',
            // pageId: savePage._id
        }

        const newPageProfile = new PageProfile(pageprofile)

        // make new pagesetting
        const pageSetting = {
            theme: 'dark',
            language: 'en',
            country: '',
        }

        const hashedPass = genPassword(password);

        const profilePic = `https://avatar.iran.liara.run/username?username=${username}`;

        try {
            const newPage = new Page({
                username,
                fullname,
                email,
                password: hashedPass.hash,
                salt: hashedPass.salt,
                pageType: pageType,
                lastLogin: Date(),
                active: 1,
                profilePicture: profilePic,
                pageProfile: newPageProfile._id,
                pageSetting: pageSetting
            });

            const [, savePage] = await Promise.all([
                newPageProfile.save(),
                newPage.save(),
            ])

            generateTokenAndSetCookie(savePage._id, res);

            return res.status(200).json({
                success: true,
                msg: 'Signup Success!',
                data: {
                    pageId: savePage._id,
                    profilePicture: savePage.profilePicture
                }
            });
        } catch (err) {
            console.log(`Error in newPage: ${err}`);
            const error = new Error(`Bad Request!`);
            error.status = 400;
            return next(error);
        }
    } catch (err) {
        console.log(`Error in newPage : ${err}`);
        const error = new Error(`Internal Server Error`)
        error.status = 500;
        return next(error);
    }
}

export const login = async (req, res, next) => {
    try {
        const data = req.validatedData;

        const { username, password } = data;

        const findPage = await Page.findOne({ username }).select('password salt profilePicture')

        if (!findPage || !validatePassword(password, findPage.password || "", findPage.salt || "")) {
            const error = new Error('invalid credentials');
            error.status = 400;
            return next(error);
        }

        generateTokenAndSetCookie(findPage._id, res);

        return res.status(200).json({
            success: true,
            msg: 'Logged In Successfully',
            data: {
                pageId: findPage._id,
                profilePicture: findPage.profilePicture,
            }
        });
    } catch (err) {
        console.log(`Error in login : ${err}`);
        const error = new Error(`Internal Server Error`);
        error.status = 500;
        return next(error);
    }
}

export const logout = async (req, res, next) => {
    try {
        res.cookie('jwt', '', { maxAge: 0 })
        res.status(200).json({
            success: true,
            msg: 'logged out successfully'
        });
    } catch (err) {
        console.log(`Error in logout : ${err}`);
        const error = new Error(`Internal Server Error`);
        error.status = 500;
        return next(error);
    }
}