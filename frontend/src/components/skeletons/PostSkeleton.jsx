const PostSkeleton = () => {
	return (
		<div className="flex w-96 flex-col gap-4 max-w-56 mx-auto md:max-w-full">
			<div className="skeleton h-64 w-full"></div>
			<div className="flex gap-2">
				<div className="skeleton h-4 w-5"></div>
				<div className="skeleton h-4 w-5"></div>
				<div className="skeleton h-4 w-5"></div>
			</div>
			<div className="skeleton h-4 w-full"></div>
			<div className="skeleton h-4 w-full"></div>
		</div>
	);
};

export default PostSkeleton;
