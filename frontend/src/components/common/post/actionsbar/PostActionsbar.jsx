import PostActionbarLike from "./like/PostActionbarLike";
import PostActionbarComment from "./comment/PostActionbarComment";
import PostActionShare from "./share/PostActionShare";
import PostActionSave from "./save/PostActionSave";

const PostActionsbar = ({ post, postType }) => {
	return (
		<div className="flex justify-between w-full mt-auto">
			<div className="flex">
				<PostActionbarLike
					post={post}
					postType={postType}
				/>

				<PostActionbarComment post={post} postType={postType} />

				<PostActionShare post={post} />
			</div>

			<PostActionSave post={post} />
		</div>
	);
};

export default PostActionsbar;
