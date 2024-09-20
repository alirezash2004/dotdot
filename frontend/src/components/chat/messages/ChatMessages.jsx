import { useEffect, useRef } from "react";

import useGetMessages from "../../Hooks/useGetMessages";

import ChatMessage from "./ChatMessage";

import Loading from "../../common/Loading";
import useListenMessages from "../../Hooks/useListenMessages";

const ChatMessages = () => {
	const { loading, messages } = useGetMessages();
	const lastMessageRef = useRef(null);

	useEffect(() => {
		setTimeout(() => {
			lastMessageRef?.current?.scrollIntoView({
				behavior: "smooth",
				block: "end",
			});
		}, 100);
	}, [messages]);

	return (
		<div className="px-4 flex-1 overflow-auto">
			{loading ? (
				<Loading />
			) : !messages || messages?.length === 0 ? (
				<p className="text-center my-5">No Messages</p>
			) : null}
			{!loading &&
				messages?.length > 0 &&
				messages.map((message, idx) => (
					<div key={idx} ref={lastMessageRef}>
						<ChatMessage
							message={message}
							lastMsg={idx === messages.length - 1}
						/>
					</div>
				))}
		</div>
	);
};

export default ChatMessages;
