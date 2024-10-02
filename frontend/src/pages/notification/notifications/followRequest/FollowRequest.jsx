import { Link } from "react-router-dom";
import changeHost from "../../../../utils/changeHost.js";
import { CiCircleCheck, CiCircleRemove } from "react-icons/ci";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import Loading from "../../../../components/common/Loading.jsx";

const FollowRequest = ({ request, setFollowNotifications }) => {
	const page = request.pageId;

	const {
		mutate: followRequestAction,
		isPending: isFollowRequestActionPending,
	} = useMutation({
		mutationFn: async ({ action }) => {
			try {
				const res = await fetch(
					`/api/v1.0/followingRelationships/action/${request._id}`,
					{
						method: action === "accept" ? "POST" : "DELETE",
					}
				);

				if (res.status === 500) {
					throw new Error("Internal Server Error");
				}

				const data = await res.json();

				if (!res.ok || data.success === false)
					throw new Error(data.msg || "Failed To Accept/Decline Request");

				return data;
			} catch (error) {
				throw new Error(error);
			}
		},

		onSuccess: (returnData) => {
			toast.success(returnData.msg);
			setFollowNotifications((prevData) =>
				prevData.filter((item) => item._id !== request._id)
			);
		},
		onError: (error) => {
			toast.error(`Follow Request Process Failed! ${error.message}`);
		},
	});

	return (
		<div className="border-b border-gray-800" id={`request-${request._id}`}>
			<div className="flex gap-2 items-center p-4 relative justify-between">
				<Link
					to={`/profile/${page.username}`}
					className="flex gap-5 flex-wrap ml-2"
				>
					<div className="avatar">
						<div className="w-8 mask mask-squircle">
							<img
								src={
									changeHost(page.profilePicture) || "/avatar-placeholder.png"
								}
								alt="Profile Picture"
							/>
						</div>
					</div>
					<div className="flex gap-1 flex-wrap items-center">
						<span className="font-bold">{page.fullName}</span>
						<span className="text-sm">@{page.username}</span>
					</div>
				</Link>

				<div className="flex items-center gap-6">
					<button
						className={`btn ml-auto text-2xl flex btn-outline ${
							isFollowRequestActionPending ? "btn-disabled" : "btn-success"
						} transition-all duration-300`}
						onClick={() => {
							if (isFollowRequestActionPending) return;
							followRequestAction({ action: "accept" });
						}}
					>
						{isFollowRequestActionPending && <Loading size="sm" />}
						{!isFollowRequestActionPending && <CiCircleCheck />}
						<span className="hidden md:block text-sm">Accept</span>
					</button>
					<button
						className={`btn ml-auto text-2xl flex btn-outline ${
							isFollowRequestActionPending ? "btn-disabled" : "btn-error"
						} transition-all duration-300`}
						onClick={() => {
							if (isFollowRequestActionPending) return;
							followRequestAction({ action: "decline" });
						}}
					>
						{isFollowRequestActionPending && <Loading size="sm" />}
						{!isFollowRequestActionPending && <CiCircleRemove />}
						<span className="hidden md:block text-sm">Decline</span>
					</button>
				</div>
			</div>
		</div>
	);
};

export default FollowRequest;
