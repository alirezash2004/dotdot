import { useEffect, useRef } from "react";

import useGetMessages from "../../../../components/Hooks/useGetMessages";

import ChatMessage from "./message/ChatMessage";

import ChatMessagesSkeleton from "../../../../components/skeletons/ChatMessagesSkeleton";

const ChatMessages = () => {
	const { loading, messages } = useGetMessages();
	const lastMessageRef = useRef(null);

	useEffect(() => {
		setTimeout(() => {
			lastMessageRef?.current?.scrollIntoView({
				behavior: "smooth",
				block: "end",
			});
		}, 500);
	}, [messages]);

	return (
		<div className="px-4 flex-1 overflow-auto">
			{loading ? (
				<>
					<ChatMessagesSkeleton />
					<ChatMessagesSkeleton chatPlace="start" />
					<ChatMessagesSkeleton />
					<ChatMessagesSkeleton chatPlace="start" />
					<ChatMessagesSkeleton />
					<ChatMessagesSkeleton chatPlace="start" />
				</>
			) : // <Loading />
			!messages || messages?.length === 0 ? (
				<p className="text-center my-5">No Messages</p>
			) : null}
			{!loading &&
				messages?.length > 0 &&
				messages.map((message, idx) => (
					<ChatMessage
						key={idx}
						message={message}
						lastMsg={idx === messages.length - 1}
						refrence={lastMessageRef}
					/>
				))}
		</div>
	);
};

export default ChatMessages;
