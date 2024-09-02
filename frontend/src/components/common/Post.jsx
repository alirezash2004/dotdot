import { useQuery } from "@tanstack/react-query";
import { useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import "react-lazy-load-image-component/src/effects/blur.css";

import useDeletePost from "../Hooks/PostHooks/useDeletePost.jsx";
import useLikeUnlikePost from "../Hooks/PostHooks/useLikeUnlikePost.jsx";
import useCommentOnPost from "../Hooks/PostHooks/useCommentOnPost.jsx";
import useSaveUnsavePost from "../Hooks/PostHooks/useSaveUnsavePost.jsx";

import Loading from "./Loading";
import HorizontalScrollCarousel from "./HorizontalScrollCarousel";

import { formatDate } from "../../utils/date";
import changeHost from "../../utils/changeHost.js";

import {
	CiBookmark,
	CiChat1,
	CiHeart,
	CiLocationArrow1,
	CiTrash,
} from "react-icons/ci";

const Post = ({ post, postType = "" }) => {
	const postId = post._id;
	const commentBox = useRef(null);
	const [showFullCaption, setShowFullCaption] = useState(false);
	const [comment, setComment] = useState("");
	const postSender = post.page;
	const [isLiked, setIsLiked] = useState(post.isLiked);
	const [isSaved, setIsSaved] = useState(post.isSaved);
	const [numberOfLikes, setNumberOfLikes] = useState(post.numberOfLikes);

	const { data: authPage } = useQuery({ queryKey: ["authPage"] });

	const { deletePost, isDeletePending } = useDeletePost({ postId });

	const { likeUnlikePost, isLikeUnlikePending } = useLikeUnlikePost({
		postId,
		postType,
		setIsLiked,
		setNumberOfLikes,
	});

	const { commentOnPost, isCommentPending } = useCommentOnPost({
		postId,
		postType,
		setComment,
		commentBox,
		postCommentsArr: post.comments,
	});

	const { saveUnsavePost, isSaveUnsavePending } = useSaveUnsavePost({
		postId,
		setIsSaved,
	});

	const isMyPost = authPage._id === post.page?._id;

	const formattedDate = formatDate(post.createdAt);

	const handleDeletePost = () => {
		deletePost();
	};

	// TODO: add ability to delete self comments
	const handlePostComment = (e) => {
		e.preventDefault();
		if (isCommentPending) return;
		commentOnPost(comment);
	};

	const handleLikePost = () => {
		if (isLikeUnlikePending) return;
		likeUnlikePost();
	};

	// TODO: add share post
	const handleSharePost = () => {
		toast.error("Sorry, sharing posts are not available yet");
		// sharePost();
	};

	const handleSavePost = () => {
		if (isSaveUnsavePending) return;
		saveUnsavePost();
	};

	let caption;
	if (post.caption) {
		caption =
			!showFullCaption && post.caption.length > 90
				? post.caption.substring(0, 90) + "..."
				: post.caption;
	} else {
		caption = "";
	}

	const postMediaData = useMemo(() => {
		return (
			<HorizontalScrollCarousel
				imgs={post.assets.map((asset) => changeHost(asset.url))}
			/>
		);
	}, [post.assets]);

	const postUrl = changeHost(post.assets[0].url);

	return postType === "pageProfile" ? (
		<>
			<Link
				to={`/post/${post?._id}`}
				className="flex w-full aspect-square border border-slate-800 group/post"
			>
				<img
					src={postUrl}
					alt=""
					className="w-full object-cover opacity-80 group-hover/post:opacity-100 transition-all duration-200 pointer-events-none"
				/>
			</Link>
		</>
	) : (
		<>
			<div className="flex mb-14 mx-4 md:mx-auto gap-2 flex-col items-start pb-4 border rounded-lg p-5 border-gray-700 md:w-3/4">
				<div className="flex w-full">
					<div className="avatar">
						<Link
							to={`/profile/${postSender.username}`}
							className="w-8 rounded-full overflow-hidden"
						>
							<img
								src={
									changeHost(postSender.profilePicture) ||
									"/avatar-placeholder.png"
								}
								className="aspect-square pointer-events-none"
							/>
						</Link>
					</div>
					<div className="flex gap-2 items-center">
						<Link
							to={`/profile/${postSender.username}`}
							className="font-bold ml-2"
						>
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
				{/* TODO: make double like animated */}
				<div
					className="flex flex-col mt-2 w-full"
					onDoubleClick={() => {
						if (!isLiked) handleLikePost();
					}}
				>
					{postMediaData}
					{caption && (
						<p
							className="my-3 cursor-pointer px-2 md:w-96"
							onClick={() => setShowFullCaption((prevState) => !prevState)}
						>
							{caption}
						</p>
					)}
				</div>
				<div className="flex justify-between w-full mt-auto">
					<div className="flex">
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
						<div
							className="flex gap-1 items-center cursor-pointer group mx-6"
							onClick={() =>
								document
									.getElementById("comments_modal_" + post?._id)
									.showModal()
							}
						>
							<CiChat1 className="w-6 h-6  text-slate-500 group-hover:text-sky-400" />
							<span className="text-sm text-slate-500 group-hover:text-sky-400">
								{post?.comments.length || 0}
							</span>
						</div>
						<div className="flex gap-1 items-center cursor-pointer group">
							<CiLocationArrow1
								onClick={handleSharePost}
								className="w-6 h-6  text-slate-500 group-hover:text-red-400"
							/>
						</div>
					</div>
					<div className="flex gap-1 items-center cursor-pointer group">
						{!isSaveUnsavePending && (
							<CiBookmark
								onClick={handleSavePost}
								className={`w-6 h-6 group-hover:text-gray-400 ${
									isSaved ? "text-cyan-400" : "text-slate-500"
								}`}
							/>
						)}
						{isSaveUnsavePending && <Loading size="sm" />}
					</div>
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
														comment.page.profilePicture ||
														"/avatar-placeholder.png"
													}
												/>
											</div>
										</div>
										<div className="flex flex-col">
											<div className="flex items-center gap-1">
												<span className="font-bold">
													{comment.page.fullName}
												</span>
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
				</div>
			</div>
		</>
	);
};

export default Post;
