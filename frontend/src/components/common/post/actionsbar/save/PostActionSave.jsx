import { useState } from "react";

import useSaveUnsavePost from "../../../../Hooks/PostHooks/useSaveUnsavePost";

import Loading from "../../../Loading";

import { CiBookmark } from "react-icons/ci";

const PostActionSave = ({ post }) => {
	const postId = post._id;

	const [isSaved, setIsSaved] = useState(post.isSaved);

	const { saveUnsavePost, isSaveUnsavePending } = useSaveUnsavePost({
		postId,
		setIsSaved,
	});
	const handleSavePost = () => {
		if (isSaveUnsavePending) return;
		saveUnsavePost();
	};

	return (
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
	);
};

export default PostActionSave;
