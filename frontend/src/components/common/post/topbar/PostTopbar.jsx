import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";

import useDeletePost from "../../../Hooks/PostHooks/useDeletePost";

import Loading from "../../Loading";

import changeHost from "../../../../utils/changeHost.js";
import { formatDate } from "../../../../utils/date";

import { CiTrash } from "react-icons/ci";

const PostTopbar = ({ post }) => {
	const postId = post._id;
	const postSender = post.page;

	const formattedDate = formatDate(post.createdAt);

	const { data: authPage } = useQuery({ queryKey: ["authPage"] });

	const isMyPost = authPage._id === post.page?._id;

	const { deletePost, isDeletePending } = useDeletePost({ postId });
    
    const handleDeletePost = () => {
		deletePost();
	};

    
	return (
		<div className="flex w-full">
			<div className="avatar">
				<Link
					to={`/profile/${postSender.username}`}
					className="w-8 rounded-full overflow-hidden"
				>
					<img
						src={
							changeHost(postSender.profilePicture) || "/avatar-placeholder.png"
						}
						className="aspect-square pointer-events-none"
					/>
				</Link>
			</div>
			<div className="flex gap-2 items-center">
				<Link to={`/profile/${postSender.username}`} className="font-bold ml-2">
					{postSender.fullName}
				</Link>
				<span className="text-gray-700 flex gap-1 text-sm">
					<span>·</span>
					<span>{formattedDate}</span>
				</span>
			</div>
			{isMyPost && (
				<span className="flex items-center justify-end flex-1">
					{!isDeletePending && (
						<CiTrash
							className="cursor-pointer hover:text-red-500"
							onClick={handleDeletePost}
						/>
					)}
					{isDeletePending && <Loading size="sm" />}
				</span>
			)}
		</div>
	);
};

export default PostTopbar;
