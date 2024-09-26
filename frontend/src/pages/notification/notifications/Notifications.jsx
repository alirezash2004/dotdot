import { useQuery } from "@tanstack/react-query";

import Loading from "../../../components/common/Loading";

import Notification from "./notification/Notification";

import { CiFaceSmile } from "react-icons/ci";
import { useState } from "react";
import FollowRequest from "./followRequest/FollowRequest";

const Notifications = ({ isDeletePending }) => {
	const [followNotifications, setFollowNotifications] = useState([]);
	const [showFollowRequest, setShowFollowRequest] = useState(true);
	const { data: notifications, isPending: isNotificationsPending } = useQuery({
		queryKey: ["notifications"],
		queryFn: async () => {
			try {
				const res = await fetch("/api/v1.0/notifications");
				const data = await res.json();

				if (!res.ok || data.success === false)
					throw new Error(data.msg || "Failed To Fetch Notifs");

				if (data.followRequests.length > 3) {
					setShowFollowRequest(false);
				}
				setFollowNotifications(data.followRequests);

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

			{followNotifications?.length > 0 && (
				<>
					<div className="text-center p-4 font-bold flex gap-2 items-center justify-center">
						<span>
							You have {followNotifications.length} follow request
							{followNotifications?.length > 1 ? "s" : ""}
						</span>
						<button
							className={`btn rounded-full btn-outline ${
								showFollowRequest ? "" : "btn-primary"
							}`}
							onClick={() => setShowFollowRequest((prevData) => !prevData)}
						>
							{showFollowRequest
								? "Hide Follow Requests"
								: "Show Follow Requests"}
						</button>
					</div>

					{showFollowRequest &&
						followNotifications?.map((request) => (
							<FollowRequest
								key={request._id}
								request={request}
								setFollowNotifications={setFollowNotifications}
							/>
						))}
				</>
			)}

			{notifications?.length === 0 && followNotifications?.length === 0 && (
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
