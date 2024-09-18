const ChatMessage = () => {
	return (
		<div className="chat chat-end">
			<div className="chat-image avatar">
				<div className="w-10 rounded-full">
					<img src="https://avatar.iran.liara.run/public" alt="" />
				</div>
			</div>
			<div className={`chat-bubble text-white bg-blue-500`}>Hi there</div>
            <div className="chat-footer text-xs opacity-50">10:00</div>
		</div>
	);
};

export default ChatMessage;
