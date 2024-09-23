import { useState } from "react";

import SetPageTitle from "../../components/common/SetPageTitle";

import NotificationTopbar from "./topbar/NotificationTopbar";
import Notifications from "./notifications/Notifications";

const NotificationPage = () => {
	//  TODO: add go to post for comments

	const [isDeletePending, setIsDeletePending] = useState(false);

	return (
		<>
			<SetPageTitle title="Notifications - DotDot Social Media" />

			<div className="flex-[4_4_0] border-l border-r border-gray-700 min-h-screen">
				<NotificationTopbar setIsDeletePending={setIsDeletePending} />

				<Notifications isDeletePending={isDeletePending} />
			</div>
		</>
	);
};

export default NotificationPage;
