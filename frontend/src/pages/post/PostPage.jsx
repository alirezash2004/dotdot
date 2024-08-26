import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import Post from "../../components/common/Post";
import { useState } from "react";
import PostSkeleton from "../../components/skeletons/PostSkeleton";
import toast from "react-hot-toast";

const PostPage = () => {
	let { id: postId } = useParams();
	const postIdRegx = /^[a-z0-9]{24}$/;
	const [isValidPostId, setIsValidPostId] = useState(postIdRegx.test(postId));

	const {
		data: post,
		isPending,
		isFetching,
	} = useQuery({
		queryKey: ["singlePost", postId],
		queryFn: async () => {
			try {
				const res = await fetch(`/api/v1.0/posts/${postId}`);
				const data = await res.json();

				if (!res.ok || data.success === false)
					throw new Error(data.msg || "Failed To Fetch Post!");

				return data;
			} catch (error) {
				toast.error(error.message);
				throw new Error(error);
			}
		},
		enabled: isValidPostId,
		retry: false,
	});

	return (
		<div className="flex flex-[4_4_0] flex-col pt-10">
			{(isPending || isFetching) && <PostSkeleton />}
			{!isPending && !isFetching && !post && <div className="w-full flex pt-32 items-center justify-center text-5xl text-red-700">Post Not Found!</div>}
			{!isPending && !isFetching && post && <Post postType="single" post={post} />}
		</div>
	);
};

export default PostPage;
