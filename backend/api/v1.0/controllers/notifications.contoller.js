import FollowingRelationship from "../models/followingRelationship.model.js";
import Notification from "../models/notification.model.js";

export const getNotifications = async (req, res, next) => {
    try {
        const pageId = req.user._id;

        const notifications = await Notification.find({ to: pageId })
            .select("from type post createdAt")
            .populate({
                path: 'from',
                select: 'username profilePicture'
            })
            .sort({ createdAt: -1 })

        await Notification.updateMany({ to: pageId }, { read: true });

        const followRequests = await FollowingRelationship.find({ followedPageId: pageId, status: 'pending' }).select('pageId').populate({ path: 'pageId', select: 'username fullName profilePicture' });

        return res.status(200).json({ success: true, notifications, followRequests });
    } catch (err) {
        console.log(`Error in getNotifications : ${err}`);
        const error = new Error(`Internal Server Error`);
        error.status = 500;
        return next(error);
    }
}

export const deleteNotifications = async (req, res, next) => {
    try {
        const pageId = req.user._id;

        await Notification.deleteMany({ to: pageId });

        res.status(200).json({ success: true, msg: "Notifications Deleted Successfully" });
    } catch (err) {
        console.log(`Error in deleteNotifications : ${err}`);
        const error = new Error(`Internal Server Error`);
        error.status = 500;
        return next(error);
    }
}

export const deleteNotification = async (req, res, next) => {
    try {
        const pageId = req.user._id.toString();
        const notificationId = req.validatedData.notificationId;

        const notification = await Notification.findById(notificationId);

        if (!notification) {
            const error = new Error(`Notification with id ${notificationId} was not found`);
            error.status = 404;
            return next(error);
        }

        if (notification.to.toString() !== pageId) {
            const error = new Error(`You can only delete your notifications`);
            error.status = 401;
            return next(error);
        }

        await Notification.findByIdAndDelete(notificationId);

        res.status(200).json({ success: true, msg: "Notification Deleted Successfully" });
    } catch (err) {
        console.log(`Error in deleteNotification : ${err}`);
        const error = new Error(`Internal Server Error`);
        error.status = 500;
        return next(error);
    }
}