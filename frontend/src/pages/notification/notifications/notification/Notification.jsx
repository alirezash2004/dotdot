import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

import changeHost from "../../../../utils/changeHost.js/index.js";

import Loading from "../../../../components/common/Loading";

import { CiChat1, CiHeart, CiTrash, CiUser } from "react-icons/ci";

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

	return (
		<div className="border-b border-gray-800" key={notification._id}>
			<div className="flex gap-2 items-center p-4 relative">
				{notification.type === "follow" && (
					<CiUser className="w-10 h-10 md:w-7 md:h-7 text-primary" />
				)}
				{notification.type === "like" && (
					<CiHeart className="w-10 h-10 md:w-7 md:h-7 text-red-500" />
				)}
				{notification.type === "comment" && (
					<CiChat1 className="w-10 h-10 md:w-7 md:h-7 text-secondary" />
				)}
				<Link
					to={`/profile/${notification.from.username}`}
					className="flex gap-5 flex-wrap ml-2"
				>
					<div className="avatar">
						<div className="w-8 rounded-full">
							<img
								src={
									changeHost(notification.from.profilePicture) ||
									"/avatar-placeholder.png"
								}
							/>
						</div>
					</div>
					<div className="flex gap-1 flex-wrap">
						<span className="font-bold">@{notification.from.username}</span>{" "}
						{notification.type === "follow" && "Followed you"}
						{notification.type === "like" && "Liked your post"}
						{notification.type === "comment" && "Commented on your post"}
						{notification.type === "message" && "Sent You A New Message"}
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
