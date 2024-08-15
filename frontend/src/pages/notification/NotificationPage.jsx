import { Link } from "react-router-dom";

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
	const isLoading = false;

	// tmp mock data:
	const notifications = [
		{
			_id: "1",
			from: {
				_id: "1",
				username: "johndoesssssssssss",
				profileImg: "https://avatar.iran.liara.run/public/boy",
			},
			type: "follow",
		},
		{
			_id: "2",
			from: {
				_id: "2",
				username: "janedoe",
				profileImg: "https://avatar.iran.liara.run/public/girl",
			},
			type: "like",
		},
		{
			_id: "3",
			from: {
				_id: "3",
				username: "janedoe",
				profileImg: "https://avatar.iran.liara.run/public",
			},
			type: "comment",
		},
	];

	const deleteNotifications = () => {
		alert("All notifs deleted");
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
								<a onClick={deleteNotifications}>Delete all notifications</a>
							</li>
						</ul>
					</div>
				</div>
				{isLoading && (
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
							<button className="btn ml-auto text-2xl flex">
								<CiTrash />
								<span className="hidden md:block text-sm">Delete</span>
							</button>
						</div>
					</div>
				))}
			</div>
		</>
	);
};

export default NotificationPage;
