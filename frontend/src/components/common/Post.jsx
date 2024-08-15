import { useState } from "react";

const Post = ({ post }) => {
	const [comment, setComment] = useState("");
	const postSender = post.page;
	const isLiked = false;

	const isMyPost = true;

	const formattedDate = "1h";

	const isCommenting = false;

	const handleDeletePost = () => {};

	const handlePostComment = (e) => {
		e.preventDefault();
	};

	const handleLikePost = () => {};

	return (
		<>
			<div className="flex w-96 flex-col gap-4 max-w-56 mx-auto md:max-w-full">
				<div className="skeleton h-64 w-full"></div>
				<div className="flex gap-2">
					<div className="skeleton h-4 w-5"></div>
					<div className="skeleton h-4 w-5"></div>
					<div className="skeleton h-4 w-5"></div>
				</div>
				<div className="skeleton h-4 w-full"></div>
				<div className="skeleton h-4 w-full"></div>
			</div>
		</>
	);
};

export default Post;
