import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import useConversation from "../../zustand/useConversation";

const useGetMessages = () => {
	const [loading, setLoading] = useState(false);
	const { messages, setMessages, selectedConversation } = useConversation();

	useEffect(() => {
		const getMessages = async () => {
			setLoading(true);
			try {
				const res = await fetch(
					`/api/v1.0/messages/${selectedConversation._id}`
				);
				if (res.status === 500) {
					throw new Error("Internal Server Error");
				}

				const data = await res.json();
				if (!res.ok || data.success === false) {
					throw new Error(data.msg || "Failed To Get Messages");
				}

				setMessages(data.data);
			} catch (error) {
				toast.error(error.message);
			} finally {
				setLoading(false);
			}
		};

		if (selectedConversation?._id) getMessages();
	}, [selectedConversation?._id, setMessages]);

	return { loading, messages };
};

export default useGetMessages;
