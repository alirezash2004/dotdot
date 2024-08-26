import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import Loading from "../../components/common/Loading";

import {
	CiChat1,
	CiFaceSmile,
	CiHeart,
	CiSettings,
	CiTrash,
	CiUser,
} from "react-icons/ci";

const NotificationPage = () => {
	//  TODO: add go to post for comments

	const queryClient = useQueryClient();

	const { data: notifications, isPending: isNotificationsPending } = useQuery({
		queryKey: ["notifications"],
		queryFn: async () => {
			try {
				const res = await fetch("/api/v1.0/notifications");
				const data = await res.json();

				if (!res.ok || data.success === false)
					throw new Error(data.msg || "Failed To Fetch Notifs");

				return data.notifications;
			} catch (error) {
				throw new Error(error);
			}
		},
	});

	const {
		mutate: deleteAllNotifications,
		isPending: isDeleteAllNotifsPending,
	} = useMutation({
		mutationFn: async () => {
			const res = await fetch(`/api/v1.0/notifications/`, {
				method: "DELETE",
			});
			const data = await res.json();

			if (!res.ok || data.success === false)
				throw new Error(data.msg || "Failed To Fetch Notifs");

			return data;
		},
		onSuccess: () => {
			toast.success("all notifications deleted successfully");
			queryClient.invalidateQueries({ queryKey: ["notifications"] });
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});

	const { mutate: deleteNotification, isPending: isDeleteNotifPending } =
		useMutation({
			mutationFn: async (notifId) => {
				const res = await fetch(`/api/v1.0/notifications/${notifId}`, {
					method: "DELETE",
				});
				const data = await res.json();

				if (!res.ok || data.success === false)
					throw new Error(data.msg || "Failed To Fetch Notifs");

				return notifId;
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

	const deleteNotifications = () => {
		if (isDeleteAllNotifsPending) return;
		deleteAllNotifications();
	};

	return (
		<>
			<div className="flex-[4_4_0] border-l border-r border-gray-700 min-h-screen">
				<div className="flex justify-between items-center p-4 border-b border-gray-700">
					<p className="font-bold">Notifications</p>
					<div className="dropdown dropdown-bottom dropdown-end">
						<div
							tabIndex={0}
							role="button"
							className="m-1 transition-transform duration-300 hover:rotate-45"
						>
							<CiSettings className="w-8" />
						</div>
						<ul
							tabIndex={0}
							className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
						>
							<li>
								<a onClick={() => deleteNotifications()}>
									Delete all notifications
								</a>
							</li>
						</ul>
					</div>
				</div>
				{isNotificationsPending && (
					<div className="flex justify-center h-full items-center">
						<Loading size="lg" />
					</div>
				)}
				{notifications?.length === 0 && (
					<div className="text-center p-4 font-bold">
						OOPS! No Notifications{" "}
						<CiFaceSmile className="inline-flex text-lg" />
					</div>
				)}
				{notifications?.map((notification) => (
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
												notification.from.profileImg ||
												"/avatar-placeholder.png"
											}
										/>
									</div>
								</div>
								<div className="flex gap-1 flex-wrap">
									<span className="font-bold">
										@{notification.from.username}
									</span>{" "}
									{notification.type === "follow" && "Followed you"}
									{notification.type === "like" && "Liked your post"}
									{notification.type === "comment" && "Commented on your post"}
								</div>
							</Link>
							{/* TODO: handle signle notification delete */}
							<button
								className={`btn ml-auto text-2xl flex ${
									isDeleteNotifPending || isDeleteAllNotifsPending
										? "btn-disabled"
										: ""
								}`}
								onClick={() => deleteNotification(notification._id)}
							>
								{(isDeleteNotifPending || isDeleteAllNotifsPending) && (
									<Loading size="sm" />
								)}
								{!(isDeleteNotifPending || isDeleteAllNotifsPending) && (
									<>
										<CiTrash />
										<span className="hidden md:block text-sm">Delete</span>
									</>
								)}
							</button>
						</div>
					</div>
				))}
			</div>
		</>
	);
};

export default NotificationPage;
