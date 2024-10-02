import { PageProfilePost } from "../PageProfilePost";
import { useMemo, useState } from "react";

import HorizontalScrollCarousel from "../HorizontalScrollCarousel";

import changeHost from "../../../utils/changeHost.js/index.js";

import PostTopbar from "./topbar/PostTopbar";
import PostActionsbar from "./actionsbar/PostActionsbar";

const Post = ({ post, postType = "" }) => {
	const [showFullCaption, setShowFullCaption] = useState(false);

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
		<PageProfilePost post={post} postUrl={postUrl} />
	) : (
		<>
			<div className="flex mb-14 mx-4 md:mx-auto gap-2 flex-col items-start pb-4 border rounded-lg p-5 border-gray-700 md:w-3/4">
				<PostTopbar post={post} />

				{/* double tap animated like */}
				<div
					className="flex flex-col mt-2 w-full"
					onDoubleClick={() => {
						document.querySelector(`#like_post_${post._id}_btn`).click();
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

				<PostActionsbar post={post} postType={postType} />
			</div>
		</>
	);
};

export default Post;
