import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

import changeHost from "../../../../utils/changeHost.js/index.js";
import { formatDate } from "../../../../utils/date/index.js";

import Loading from "../../../../components/common/Loading";

import {
	CiChat1,
	CiHeart,
	CiLocationArrow1,
	CiTrash,
	CiUser,
} from "react-icons/ci";

const Notification = ({ notification, isDeletePending }) => {
	const queryClient = useQueryClient();

	const { mutate: deleteNotification, isPending: isDeleteNotifPending } =
		useMutation({
			mutationFn: async (notifId) => {
				try {
					const res = await fetch(`/api/v1.0/notifications/${notifId}`, {
						method: "DELETE",
					});

					if (res.status === 500) {
						throw new Error("Internal Server Error");
					}

					const data = await res.json();

					if (!res.ok || data.success === false)
						throw new Error(data.msg || "Failed To Fetch Notifs");

					return notifId;
				} catch (error) {
					throw new Error(error);
				}
			},
			onSuccess: (notifId) => {
				toast.success("notification deleted successfully");
				queryClient.setQueryData(["notifications"], (oldData) => {
					return oldData.filter((notif) => {
						return notif._id !== notifId;
					});
				});
			},
			onError: (error) => {
				toast.error(error.message);
			},
		});

	const getNotificationLink = () => {
		switch (notification.type) {
			case "follow":
			case "followrequest":
				return `/profile/${notification.from.username}`;

			case "message":
				return `/chat/${notification.from.username}`;

			case "like":
			case "comment":
				return `/post/${notification.post}`;
		}
	};

	return (
		<div className="border-b border-gray-800">
			<div className="flex gap-2 items-center p-4 relative">
				{notification.type === "follow" && (
					<CiUser className="w-7 h-7 text-primary" />
				)}
				{notification.type === "followAccept" && (
					<CiUser className="w-7 h-7 text-primary" />
				)}
				{notification.type === "unFollow" && (
					<CiUser className="w-7 h-7 text-red-500" />
				)}
				{notification.type === "like" && (
					<CiHeart className="w-7 h-7 text-red-500" />
				)}
				{notification.type === "comment" && (
					<CiChat1 className="w-7 h-7 text-secondary" />
				)}
				{notification.type === "message" && (
					<CiLocationArrow1 className="w-7 h-7 text-secondary" />
				)}
				<Link to={getNotificationLink()} className="flex gap-3 flex-wrap ml-2">
					<div className="avatar">
						<div className="w-8 mask mask-squircle">
							<img
								src={
									changeHost(notification.from.profilePicture) ||
									"/avatar-placeholder.png"
								}
								alt="Profile Picture"
							/>
						</div>
					</div>
					<div className="flex gap-1 flex-wrap items-center">
						<span className="font-bold">@{notification.from.username}</span>{" "}
						{notification.type === "followAccept" &&
							"Accepted You Follow Request"}
						{notification.type === "follow" && "Followed you"}
						{notification.type === "unFollow" && (
							<span>
								<span className="text-red-500">UnFollowed</span> you
							</span>
						)}
						{notification.type === "like" && "Liked your post"}
						{notification.type === "comment" && "Commented on your post"}
						{notification.type === "message" && "Sent You A New Message"}
						<span className="text-sm text-slate-500">
							{formatDate(notification.createdAt)}
						</span>
					</div>
				</Link>

				<button
					className={`btn ml-auto text-2xl flex ${
						isDeleteNotifPending || isDeletePending ? "btn-disabled" : ""
					}`}
					onClick={() => deleteNotification(notification._id)}
				>
					{(isDeleteNotifPending || isDeletePending) && <Loading size="sm" />}
					{!(isDeleteNotifPending || isDeletePending) && (
						<>
							<CiTrash />
							<span className="hidden md:block text-sm">Delete</span>
						</>
					)}
				</button>
			</div>
		</div>
	);
};

export default Notification;
