import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";

import useConversation from "../../../../../zustand/useConversation";

import changeHost from "../../../../../utils/changeHost.js";

import { formatDate } from "../../../../../utils/date";

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

	const postNotExists = !message.message.text && message.message.post === null;

	const post = message.message.post
		? changeHost(message.message.post?.assets[0]?.url)
		: null;

	const messageType = message.message.text ? "text" : "post";

	return (
		<div className={`chat ${isMyMessage ? "chat-end" : "chat-start"} mt-2`}>
			<div className="chat-image avatar">
				<div className="w-10 rounded-full">
					<img src={profilePicture} alt="" />
				</div>
			</div>
			<div
				className={`chat-bubble ${post && "px-2"} text-white ${
					isMyMessage && "bg-blue-500"
				}`}
			>
				{messageType === "text" && message.message.text}
				{postNotExists && (
					<Link className="relative flex w-60">
						<span className="absolute left-0 top-0 w-full bg-slate-800 bg-opacity-70 z-50 text-lg rounded-md p-2">
							Post - Not Exist
						</span>
						<img
							className="rounded-md aspect-square object-cover brightness-75 w-full"
							src="https://placehold.co/400/bc0000/white?text=Post+not+found+\n+404&font=open-sans"
						/>
					</Link>
				)}
				{post && (
					<Link
						to={`/post/${message.message.post._id}`}
						className="relative flex w-60"
					>
						<span className="absolute left-0 top-0 w-full bg-slate-800 bg-opacity-70 z-50 text-lg rounded-md p-2">
							Post
						</span>
						<img
							className="rounded-md aspect-square object-cover brightness-75 w-full"
							src={post}
						/>
					</Link>
				)}
			</div>
			<div className="chat-footer text-xs opacity-50 pt-1">
				{formatDate(message.updatedAt)} {isRead && " - Read"}
			</div>
		</div>
	);
};

export default ChatMessage;
