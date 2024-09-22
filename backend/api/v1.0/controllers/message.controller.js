import mongoose, { isValidObjectId } from "mongoose";

import Page from "../models/page.model.js";
import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import Notification from "../models/notification.model.js";
import { io } from "../../../socket/socket.js";
import { getPageSocketId } from "../../../socket/socket.js";
import Post from "../models/post.model.js";

export const getPagesForSidebar = async (req, res, next) => {
    try {
        const authPageId = req.user._id.toString();

        // TODO: add skip & limit
        const conversations = await Conversation.aggregate([
            // Match the conversations where the user is a participant
            {
                $match: {
                    participants: { $in: [new mongoose.Types.ObjectId(authPageId)] }
                }
            },
            // Lookup (populate) the participants field with only specific fields
            {
                $lookup: {
                    from: 'pages', // assuming 'Page' collection is called 'pages'
                    localField: 'participants',
                    foreignField: '_id',
                    as: 'participants',
                    pipeline: [
                        {
                            $project: {
                                _id: 1,
                                fullName: 1,
                                username: 1,
                                profilePicture: 1
                            }
                        }
                    ]
                }
            },
            // Filter out the authPageId from the participants array
            {
                $addFields: {
                    participants: {
                        $filter: {
                            input: "$participants",
                            as: "participant",
                            cond: { $ne: ["$$participant._id", new mongoose.Types.ObjectId(authPageId)] }
                        }
                    }
                }
            },
            // Lookup (populate) the messages field
            {
                $lookup: {
                    from: 'messages', // assuming the 'Message' collection is called 'messages'
                    localField: 'messages',
                    foreignField: '_id',
                    as: 'messages'
                }
            },
            // Sort messages within each conversation by the 'createdAt' field in descending order
            {
                $addFields: {
                    lastMessage: { $arrayElemAt: [{ $sortArray: { input: "$messages", sortBy: { createdAt: -1 } } }, 0] }
                }
            },
            // Sort conversations by the 'createdAt' field of the last message
            {
                $sort: { "lastMessage.createdAt": -1 }
            },
            // Project only the required fields
            {
                $project: {
                    participants: 1, // Include the filtered participants with selected fields
                    lastMessage: 1,
                }
            }
        ]);

        return res.status(200).json({ success: true, data: conversations })
    } catch (err) {
        console.log(`Error in getPagesForSidebar : ${err}`);
        const error = new Error(`Internal Server Error`)
        error.status = 500;
        return next(error);
    }
}


export const getMessages = async (req, res, next) => {
    try {
        const data = req.validatedData;
        const currentPageId = req.user._id.toString();
        const targetPageId = data.pageId;

        const isValidId = isValidObjectId(targetPageId);

        if (!isValidId) {
            const err = new Error(`pageId is not valid!`);
            err.status = 400;
            return next(err);
        }

        if (currentPageId === targetPageId) {
            const err = new Error(`you can not send to yourself`);
            err.status = 400;
            return next(err);
        }

        const targetPageExists = await Page.exists({ _id: targetPageId }).exec();

        if (!targetPageExists) {
            const err = new Error(`A page with page id ${targetPageId} was not found!`);
            err.status = 404;
            return next(err);
        }

        // TODO: add chuck by chunk process of messages(skip & limit)
        const [_, conversation] = await Promise.all([
            Message.updateMany({ from: targetPageId, to: currentPageId, read: false }, { read: true }),
            Conversation
                .findOne({
                    participants: { $all: [currentPageId, targetPageId] }
                })
                .populate({
                    path: 'messages',
                    select: 'message.text message.post updatedAt from to read',
                    populate: {
                        path: 'message.post',
                        select: 'assetType assets caption page',
                    }
                })
        ])

        // check if post exist
        if (conversation && conversation.messages) {
            conversation.messages = conversation.messages.map(message => {
                if (message.message && message.message.post && message.message.post.assets) {
                    message.message.post.assets = message.message.post.assets.slice(0, 1)
                }
                return message
            })
        }

        const toSocketId = getPageSocketId(targetPageId);
        if (toSocketId) {
            io.to(toSocketId).emit('messageRead', { to: currentPageId });
        }

        if (!conversation) {
            return res.status(200).json([]);
        }

        const messages = conversation.messages;

        return res.status(200).json({ success: true, data: messages });
    } catch (err) {
        console.log(`Error in getMessages : ${err}`);
        const error = new Error(`Internal Server Error`)
        error.status = 500;
        return next(error);
    }
}

export const sendMessage = async (req, res, next) => {
    try {
        const data = req.validatedData;
        const from = req.user._id.toString();
        const to = data.pageId;
        let sendedPost = null;

        let message = { from: from, to: to }
        if (data.text) {
            message.message = {
                text: data.text
            }
        } else if (data.post) {
            message.message = {
                post: data.post
            }
            const isValidPostId = isValidObjectId(data.post);

            if (!isValidPostId) {
                const err = new Error(`postid is not valid!`);
                err.status = 400;
                return next(err);
            }

            sendedPost = await Post.findById(data.post).select('assetType assets caption page')

            if (!sendedPost) {
                const err = new Error(`post not found!`);
                err.status = 404;
                return next(err);
            }
        } else {
            const err = new Error(`text or post required`);
            err.status = 400;
            return next(err);
        }

        const isValidId = isValidObjectId(to);

        if (!isValidId) {
            const err = new Error(`pageId is not valid!`);
            err.status = 400;
            return next(err);
        }

        if (from === to) {
            const err = new Error(`you can not send message to yourself`);
            err.status = 400;
            return next(err);
        }

        const targetPageExists = await Page.exists({ _id: to }).exec();

        if (!targetPageExists) {
            const err = new Error(`A page with page id ${to} was not found!`);
            err.status = 404;
            return next(err);
        }

        let conversation = await Conversation.findOne({
            participants: { $all: [from, to] },
        })

        if (!conversation) {
            conversation = await Conversation.create({
                participants: [from, to],
            })
        }

        const newMessage = new Message(message);

        if (newMessage) {
            conversation.messages.push(newMessage._id);
        }

        let notification = await Notification.findOne({
            from,
            to,
            type: 'message',
        })

        if (!notification) {
            notification = new Notification({
                from,
                to,
                type: 'message',
            });
        } else {
            notification.updatedAt = Date.now();
            notification.read = false;
        }

        await Promise.all([
            newMessage.save(),
            conversation.save(),
            notification.save()
        ])

        newMessage.message.post = sendedPost;

        // SOCKET.IO FUNCTIONALITY
        const toSocketId = getPageSocketId(to);
        if (toSocketId) {
            io.to(toSocketId).emit('newMessage', newMessage);
        }

        return res.status(201).json({ success: true, msg: "message successfully sent", data: newMessage });
    } catch (err) {
        console.log(`Error in sendMessage : ${err}`);
        const error = new Error(`Internal Server Error`)
        error.status = 500;
        return next(error);
    }
}

export const setReadMessages = async (req, res, next) => {
    try {
        const data = req.validatedData;
        const currentPageId = req.user._id.toString();
        const targetPageId = data.pageId;

        const isValidId = isValidObjectId(targetPageId);

        if (!isValidId) {
            const err = new Error(`pageId is not valid!`);
            err.status = 400;
            return next(err);
        }

        if (currentPageId === targetPageId) {
            const err = new Error(`you can not send message to yourself`);
            err.status = 400;
            return next(err);
        }

        let conversation = await Conversation.findOne({
            participants: { $all: [currentPageId, targetPageId] },
        })

        if (!conversation) {
            const err = new Error(`there is no conversation with this page`);
            err.status = 404;
            return next(err);
        }

        await Promise.all([
            Message.updateMany({ from: targetPageId, to: currentPageId, read: false }, { read: true }),
            Notification.updateMany({ from: currentPageId, to: targetPageId, type: "message", read: false }, { read: true })
        ])

        const toSocketId = getPageSocketId(targetPageId);
        if (toSocketId) {
            io.to(toSocketId).emit('messageRead', { to: currentPageId });
        }

        return res.status(201).json({ success: true, msg: "all messages set to read" })
    } catch (err) {
        console.log(`Error in setReadMessages : ${err}`);
        const error = new Error(`Internal Server Error`)
        error.status = 500;
        return next(error);
    }
}