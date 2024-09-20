import { useQuery } from "@tanstack/react-query";

import useConversation from "../../../zustand/useConversation";

import changeHost from "../../../utils/changeHost.js";
import { formatDate } from "../../../utils/date/index.js";

const ChatMessage = ({ message, lastMsg }) => {
	const { data: authPage } = useQuery({ queryKey: ["authPage"] });
	const { selectedConversation } = useConversation();
	const isMyMessage = message.from === authPage._id;
	const profilePicture = changeHost(
		isMyMessage
			? authPage.profilePicture
			: selectedConversation?.participants[0].profilePicture
	);

	const isRead = lastMsg && isMyMessage && message.read;

	return (
		<div className={`chat ${isMyMessage ? "chat-end" : "chat-start"} mt-2`}>
			<div className="chat-image avatar">
				<div className="w-10 rounded-full">
					<img src={profilePicture} alt="" />
				</div>
			</div>
			<div className={`chat-bubble text-white ${isMyMessage && "bg-blue-500"}`}>
				{message.text}
			</div>
			<div className="chat-footer text-xs opacity-50 pt-1">
				{formatDate(message.updatedAt)} {isRead && " - Read"}
			</div>
		</div>
	);
};

export default ChatMessage;
