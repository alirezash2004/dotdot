import { CiGrid42, CiImageOn } from "react-icons/ci";
import { Link } from "react-router-dom";

export function PageProfilePost({ post, postUrl }) {
	return (
		<Link
			to={`/post/${post?._id}`}
			className="flex w-full aspect-square border border-slate-800 group/post relative bg-slate-900"
		>
			<div className="absolute top-2 right-2 text-3xl text-slate-200 z-20">
				{post.assets.length === 1 && <CiImageOn />}
				{post.assets.length > 1 && <CiGrid42 />}
			</div>
			<img
				src={postUrl}
				alt="Post Cover"
				className="w-full object-cover opacity-80 group-hover/post:opacity-100 transition-opacity duration-200 pointer-events-none"
			/>
		</Link>
	);
}
