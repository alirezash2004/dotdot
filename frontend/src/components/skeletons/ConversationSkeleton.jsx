const ConversationSkeleton = () => {
	return (
		<div className={`flex gap-3 items-center rounded p-2 py-3 cursor-pointer`}>
			<div className="avatar offline">
				<div className="w-10 h-10 skeleton rounded-full"></div>
			</div>
			<div className="flex flex-col flex-1">
				<div className="flex gap-3 justify-between relative">
					<div className="w-14 h-3 skeleton"></div>
					<div className="w-10 h-3 skeleton"></div>
				</div>
			</div>
		</div>
	);
};

export default ConversationSkeleton;
