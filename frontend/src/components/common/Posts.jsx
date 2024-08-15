import Post from "./Post";
import PostSkeleton from "../skeletons/PostSkeleton";
import { POSTS } from "../../utils/db/MockPosts";

const Posts = () => {
	const isLoading = false;

	return (
		<>
			{isLoading && (
				<div className="flex flex-col gap-16 mx-auto my-10 md:my-24">
					<PostSkeleton />
					<PostSkeleton />
					<PostSkeleton />
				</div>
			)}
			{!isLoading && POSTS?.length === 0 && (
				<p className="text-center my-4">OOPS! No Posts Found!</p>
			)}
			{!isLoading && POSTS && (
				<div className="flex flex-col gap-16 mx-auto my-10 md:my-24">
					{POSTS.map((post) => (
						<Post key={post._id} post={post} />
					))}
				</div>
			)}
		</>
	);
};

export default Posts;
