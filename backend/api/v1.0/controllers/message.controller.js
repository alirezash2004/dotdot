import { isValidObjectId } from "mongoose";

import Page from "../models/page.model.js";
import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import Notification from "../models/notification.model.js";

export const getPagesForSidebar = async (req, res, next) => {
    try {
        const authPageId = req.user._id.toString();

        // TODO: add skip & limit
        const conversations = await Conversation.find({
            participants: { $in: [authPageId] }
        }).populate({
            path: 'participants',
            select: 'fullName username profilePicture'
        });

        const otherParticipants = conversations.flatMap(conversation =>
            conversation.participants.filter(participant => participant._id.toString() !== authPageId)
        );

        return res.status(200).json({ success: true, data: otherParticipants })
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
        const conversation = await Conversation
            .findOne({
                participants: { $all: [currentPageId, targetPageId] }
            })
            .populate({
                path: 'messages',
                select: 'text updatedAt from to',
            })

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
        const message = { from: from, to: to, text: data.text };

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

        // TODO: SOCKET IO FUNCTIONALITY

        await Promise.all([
            newMessage.save(),
            conversation.save(),
            notification.save()
        ])

        return res.status(201).json({ success: true, msg: "message successfully sent", data: newMessage });
    } catch (err) {
        console.log(`Error in sendMessage : ${err}`);
        const error = new Error(`Internal Server Error`)
        error.status = 500;
        return next(error);
    }
}