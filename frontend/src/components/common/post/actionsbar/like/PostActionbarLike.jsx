import { useState } from "react";

import useLikeUnlikePost from "../../../../Hooks/PostHooks/useLikeUnlikePost";

import Loading from "../../../Loading";

import { CiHeart } from "react-icons/ci";

const PostActionbarLike = ({ post, postType }) => {
	const postId = post._id;

	const [numberOfLikes, setNumberOfLikes] = useState(post.numberOfLikes);
	const [isLiked, setIsLiked] = useState(post.isLiked);

	const { likeUnlikePost, isLikeUnlikePending } = useLikeUnlikePost({
		postId,
		postType,
		setIsLiked,
		setNumberOfLikes,
	});

	const handleLikePost = () => {
		if (isLikeUnlikePending) return;
		likeUnlikePost();
	};

	return (
		<div
			className="flex gap-1 items-center cursor-pointer group"
			onClick={handleLikePost}
		>
			{!isLikeUnlikePending && (
				<>
					<CiHeart
						className={`w-6 h-6 group-hover:text-red-400 ${
							isLiked ? "text-red-400" : "text-slate-500"
						}`}
					/>
					<span className="text-sm text-slate-500 group-hover:text-red-400">
						{numberOfLikes}
					</span>
				</>
			)}
			{isLikeUnlikePending && <Loading size="sm" />}
		</div>
	);
};

export default PostActionbarLike;
