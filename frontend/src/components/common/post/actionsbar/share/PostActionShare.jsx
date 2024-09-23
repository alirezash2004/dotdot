import { useState } from "react";

import PostActionsShareDialog from "./dialog/PostActionShareDialog";

import useGetConversations from "../../../../Hooks/useGetConversations";

import Loading from "../../../Loading";

import { CiLocationArrow1 } from "react-icons/ci";

const PostActionShare = ({ post }) => {
	const postId = post._id;

	const {
		fetchConversations,
		conversations,
		loading: isConversationsFetching,
	} = useGetConversations({
		disableOnloadFetch: true,
	});

	const [sharePostTarget, setSharePostTarget] = useState(null);

	const handleSharePost = async () => {
		if (isConversationsFetching) return;

		if (!conversations) await fetchConversations();

		setSharePostTarget(null);

		setTimeout(() => {
			document.getElementById(`sharepost_modal_${postId}`).showModal();
		}, 100);
	};

	return (
		<div className="flex gap-1 items-center cursor-pointer group">
			{!isConversationsFetching && (
				<CiLocationArrow1
					onClick={handleSharePost}
					className="w-6 h-6  text-slate-500 group-hover:text-red-400"
				/>
			)}
			{isConversationsFetching && <Loading size="sm" />}
			<PostActionsShareDialog
				post={post}
				sharePostTarget={sharePostTarget}
				setSharePostTarget={setSharePostTarget}
				conversations={conversations}
			/>
		</div>
	);
};

export default PostActionShare;
