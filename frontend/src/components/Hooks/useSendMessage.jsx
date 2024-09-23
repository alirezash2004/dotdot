import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import useConversation from "../../zustand/useConversation";

const useSendMessage = () => {
	const { messages, setMessages } = useConversation();

	const queryClinet = useQueryClient();

	const { mutateAsync: sendMessage, isPending: isLoading } = useMutation({
		mutationFn: async ({ message, to }) => {
			const payLoad = message.post
				? { post: message.post }
				: { text: message.text };
			try {
				const res = await fetch(`/api/v1.0/messages/send/${to}`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(payLoad),
				});

				if (res.status === 500) {
					throw new Error("Internal Server Error");
				}

				const data = await res.json();

				if (!res.ok || data.success === false)
					throw new Error(data.msg || "Failed To Send Message");

				if (messages) {
					setMessages([...messages, data.data]);
				} else {
					setMessages([data.data]);
				}

				return data.data;
			} catch (error) {
				throw new Error(error);
			}
		},
		onSuccess: (newMessage) => {
			queryClinet.setQueryData(["chatConversations"], (oldData) => {
				return oldData.map((c) => {
					if (c?.participants[0]._id === newMessage.to) {
						return {
							...c,
							lastMessage: newMessage,
						};
					} else {
						return c;
					}
				});
			});
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});

	return { isLoading, sendMessage };
};

export default useSendMessage;
