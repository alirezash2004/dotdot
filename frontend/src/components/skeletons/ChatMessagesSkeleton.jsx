const ChatMessagesSkeleton = ({ chatPlace }) => {
	return (
		<div
			className={`chat ${
				chatPlace === "start" ? "chat-end" : "chat-start"
			} mt-2`}
		>
			<div className="chat-image avatar">
				<div className="w-10 h-10 skeleton rounded-full"></div>
			</div>
			<div className={`chat-bubble skeleton w-32 text-white`}></div>
		</div>
	);
};

export default ChatMessagesSkeleton;
