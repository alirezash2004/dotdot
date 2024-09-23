import { useQuery } from "@tanstack/react-query";

import Loading from "../../../components/common/Loading";

import Notification from "./notification/Notification";

import { CiFaceSmile } from "react-icons/ci";

const Notifications = ({ isDeletePending }) => {
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

	return (
		<>
			{isNotificationsPending && (
				<div className="flex justify-center h-full items-center">
					<Loading size="lg" />
				</div>
			)}

			{notifications?.length === 0 && (
				<div className="text-center p-4 font-bold">
					OOPS! No Notifications <CiFaceSmile className="inline-flex text-lg" />
				</div>
			)}

			{notifications?.map((notification) => (
				<Notification
					key={notification._id}
					isDeletePending={isDeletePending}
					notification={notification}
				/>
			))}
		</>
	);
};

export default Notifications;
