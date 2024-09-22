import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import useConversation from "../../zustand/useConversation";
import { useQueryClient } from "@tanstack/react-query";

const useGetMessages = () => {
	const queryClient = useQueryClient();
	const [loading, setLoading] = useState(false);
	const { messages, setMessages, selectedConversation } = useConversation();

	// TODO: add useQuery for fetching messages

	useEffect(() => {
		const getMessages = async () => {
			setLoading(true);
			try {
				const res = await fetch(
					`/api/v1.0/messages/${selectedConversation?.participants[0]._id}`
				);

				if (res.status === 500) {
					throw new Error("Internal Server Error");
				}

				const data = await res.json();
				if (!res.ok || data.success === false) {
					throw new Error(data.msg || "Failed To Get Messages");
				}

				setMessages(data.data);

				// console.log(queryClient.getQueryData(["chatConversations"]));

				queryClient.setQueryData(["chatConversations"], (conversations) => {
					return conversations.map((conversation) => {
						return {
							...conversation,
							lastMessage: { ...conversation.lastMessage, read: true },
						};
					});
				});
			} catch (error) {
				toast.error(error.message);
			} finally {
				setLoading(false);
			}
		};

		if (selectedConversation?.participants[0]._id) getMessages();
	}, [selectedConversation?.participants, setMessages, queryClient]);

	return { loading, messages };
};

export default useGetMessages;
