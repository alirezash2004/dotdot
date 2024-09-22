import { useEffect } from "react";
import { useSocketContext } from "../../context/useSocketContext";
import useConversation from "../../zustand/useConversation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const useListenMessages = () => {
	const { socket } = useSocketContext();

	const { selectedConversation } = useConversation();

	const { messages, setMessages } = useConversation();

	const queryClinet = useQueryClient();

	const { mutate: setReadMessages } = useMutation({
		mutationFn: async (targetPageId) => {
			try {
				const res = await fetch(`/api/v1.0/messages/sr/${targetPageId}`, {
					method: "POST",
				});

				if (res.status === 500) {
					throw new Error("Internal Server Error");
				}

				const data = await res.json();

				if (!res.ok || data.success === false)
					throw new Error(data.msg || "Failed To Logout");
			} catch (error) {
				throw new Error(error);
			}
		},
		onSuccess: () => {},
		onError: (error) => {
			toast.error(error.message);
		},
	});

	useEffect(() => {
		socket?.on("newMessage", (newMessage) => {
			if (newMessage.from === selectedConversation?.participants[0]._id) {
				setMessages([...messages, newMessage]);
				queryClinet.setQueryData(["chatConversations"], (oldData) => {
					return oldData.map((c) => {
						if (c?.participants[0]._id === newMessage.from) {
							setReadMessages(newMessage.from);
							return {
								...c,
								lastMessage: { ...newMessage, read: true },
							};
						} else {
							return c;
						}
					});
				});
			} else {
				queryClinet.setQueryData(["chatConversations"], (oldData) => {
					return oldData.map((c) => {
						if (c?.participants[0]._id === newMessage.from) {
							return {
								...c,
								lastMessage: newMessage,
							};
						} else {
							return c;
						}
					});
				});
			}
		});

		socket?.on("messageRead", (target) => {
			if (target.to === selectedConversation?.participants[0]._id) {
				setMessages(
					messages.map((message) => {
						if (target.to === message.to) {
							return { ...message, read: true };
						} else {
							return message;
						}
					})
				);
			}
		});

		return () => {
			socket?.off("newMessage");
			socket?.off("messageRead");
		};
	}, [
		socket,
		messages,
		setMessages,
		selectedConversation?.participants,
		queryClinet,
		setReadMessages,
	]);
};

export default useListenMessages;
