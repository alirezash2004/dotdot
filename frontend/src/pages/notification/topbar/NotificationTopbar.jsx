import { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { animate } from "framer-motion";
import toast from "react-hot-toast";

import { CiSettings } from "react-icons/ci";

const NotificationTopbar = ({ setIsDeletePending }) => {
	const queryClient = useQueryClient();
	const { data: notifications } = useQuery({
		queryKey: ["notifications"],
	});

	const {
		mutate: deleteAllNotifications,
		isPending: isDeleteAllNotifsPending,
	} = useMutation({
		mutationFn: async () => {
			try {
				setIsDeletePending(true);
				const res = await fetch(`/api/v1.0/notifications/`, {
					method: "DELETE",
				});

				if (res.status === 500) {
					throw new Error("Internal Server Error");
				}

				const data = await res.json();

				if (!res.ok || data.success === false)
					throw new Error(data.msg || "Failed To Fetch Notifs");

				setIsDeletePending(false);
				return data;
			} catch (error) {
				throw new Error(error);
			}
		},
		onSuccess: () => {
			toast.success("all notifications deleted successfully");
			queryClient.invalidateQueries({ queryKey: ["notifications"] });
		},
		onError: (error) => {
            toast.error(error.message);
			setIsDeletePending(false);
		},
	});
	const deleteNotifications = () => {
		if (isDeleteAllNotifsPending) return;
		if (!notifications || notifications?.length === 0) {
			toast.error("notification list is empty");
			return;
		}
		deleteAllNotifications();
	};

	useEffect(() => {
		animate([[".notifTopbar", { top: 0 }, { delay: 0, duration: 0.3 }]]);
	});

	return (
		<div className="flex justify-between items-center p-4 border-b border-gray-700 relative -top-10 notifTopbar">
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
	);
};

export default NotificationTopbar;
