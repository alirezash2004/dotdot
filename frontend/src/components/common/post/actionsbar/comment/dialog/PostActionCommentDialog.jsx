import { useRef, useState } from "react";

import useCommentOnPost from "../../../../../Hooks/PostHooks/useCommentOnPost";

import changeHost from "../../../../../../utils/changeHost.js";
import { formatDate } from "../../../../../../utils/date";

import Loading from "../../../../Loading";

import { CiLocationArrow1 } from "react-icons/ci";

const PostActionCommentDialog = ({ post, postType }) => {
	const postId = post._id;

	const commentBox = useRef(null);

	const [comment, setComment] = useState("");

	const { commentOnPost, isCommentPending } = useCommentOnPost({
		postId,
		postType,
		setComment,
		commentBox,
		postCommentsArr: post.comments,
	});

	// TODO: add ability to delete self comments
	const handlePostComment = (e) => {
		e.preventDefault();
		if (isCommentPending) return;
		commentOnPost(comment);
	};

	return (
		<dialog
			id={`comments_modal_${postId}`}
			className="modal border-none outline-none"
		>
			<div className="modal-box rounded border border-gray-700">
				<h3 className="font-bold text-lg mb-4">COMMENTS</h3>
				<div
					ref={commentBox}
					className="flex flex-col gap-3 max-h-60 overflow-auto"
				>
					{post?.comments.length === 0 && (
						<p className="text-sm text-slate-500">
							No comments yet! Write First Comment
						</p>
					)}
					{post.comments.map((comment) => (
						<div key={comment._id} className="flex gap-2 items-start">
							<div className="avatar">
								<div className="w-8 rounded-full">
									<img
										src={
											changeHost(comment.page.profilePicture) ||
											"/avatar-placeholder.png"
										}
										alt="profile picture"
									/>
								</div>
							</div>
							<div className="flex flex-col">
								<div className="flex items-center gap-1">
									<span className="font-bold">{comment.page.fullName}</span>
									<span className="text-gray-700 text-sm">
										@{comment.page.username}
									</span>
									<span className="text-gray-700 text-sm">
										· {formatDate(comment.createdAt)}
									</span>
								</div>
								<div className="text-sm">{comment.text}</div>
							</div>
						</div>
					))}
				</div>
				<form
					className="flex gap-2 mt-4 border-t border-gray-600 pt-2"
					onSubmit={handlePostComment}
				>
					<textarea
						className="textarea w-full p-2 rounded text-md resize-none border focus:outline-none  border-gray-800"
						placeholder="Add a comment..."
						value={comment}
						id="commentInp"
						name="commentInp"
						onChange={(e) => setComment(e.target.value)}
					/>
					<button
						className={`btn btn-secondary rounded btn-sm text-white min-h-20 ${
							isCommentPending ? "btn-disabled" : ""
						}`}
					>
						{isCommentPending ? (
							<Loading size="sm" />
						) : (
							<CiLocationArrow1 className="text-2xl" />
						)}
					</button>
				</form>
			</div>
			<form method="dialog" className="modal-backdrop">
				<button className="outline-none">close</button>
			</form>
		</dialog>
	);
};

export default PostActionCommentDialog;
