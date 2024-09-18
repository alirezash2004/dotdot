import { useState } from "react";
import toast from "react-hot-toast";

import useConversation from "../../zustand/useConversation";

const useSendMessage = () => {
	const [loading, setLoading] = useState(false);

	const { messages, setMessages, selectedConversation } = useConversation();

	const sendMessage = async (message) => {
		setLoading(true);
		try {
			const res = await fetch(
				`/api/v1.0/messages/send/${selectedConversation._id}`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ text: message }),
				}
			);

			if (res.status === 500) {
				throw new Error("Internal Server Error");
			}

			const data = await res.json();

			if (!res.ok || data.success === false)
				throw new Error(data.msg || "Failed To Send Message");

			setMessages([...messages, data.data]);
		} catch (error) {
			toast.error(error.message);
		} finally {
			setLoading(false);
		}
	};

	return { loading, sendMessage };
};

export default useSendMessage;
