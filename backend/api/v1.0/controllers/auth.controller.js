import generateTokenAndSetCookie from '../utils/jwtUtil.js';
import { genPassword, validatePassword } from '../utils/passwordsUtil.js';

import Page from '../models/page.model.js';
import Notification from "../models/notification.model.js";
import FollowingRelationship from '../models/followingRelationship.model.js';

export const getMe = async (req, res, next) => {
    try {
        const pageId = req.user._id;

        const page = await Page.findById(pageId).select('-password -salt -createdAt -updatedAt -likedPosts -lastLogin -active -__v');

        const notifications = await Notification.countDocuments({ to: pageId, read: false })

        const followRequests = await FollowingRelationship.countDocuments({ followedPageId: pageId, status: 'pending' })

        res.status(200).json({ success: true, page: { ...page.toObject(), notifications: notifications + followRequests } });
    } catch (err) {
        console.log(`Error in getMe : ${err}`);
        const error = new Error(`Internal Server Error`)
        error.status = 500;
        return next(error);
    }
}

export const signup = async (req, res, next) => {
    try {
        const data = req.validatedData;

        const { username, fullName, email, password } = data;

        const pageType = "public";

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
        }

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
                fullName,
                email,
                password: hashedPass.hash,
                salt: hashedPass.salt,
                pageType: pageType,
                lastLogin: Date(),
                active: 1,
                profilePicture: profilePic,
                pageProfile: pageprofile,
                pageSetting: pageSetting
            });

            const savePage = await newPage.save();

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