import PostActionCommentDialog from "./dialog/PostActionCommentDialog";

import { CiChat1 } from "react-icons/ci";

const PostActionbarComment = ({ post, postType }) => {
	return (
		<div
			className="flex gap-1 items-center cursor-pointer group mx-6"
			onClick={() =>
				document.getElementById("comments_modal_" + post?._id).showModal()
			}
		>
			<CiChat1 className="w-6 h-6  text-slate-500 group-hover:text-sky-400" />
			<span className="text-sm text-slate-500 group-hover:text-sky-400">
				{post?.comments.length || 0}
			</span>

			<PostActionCommentDialog post={post} postType={postType} />
		</div>
	);
};

export default PostActionbarComment;
