import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const useGetConversations = () => {
	const [loading, setLoading] = useState(false);
	const [conversations, setConversations] = useState([]);

	useEffect(() => {
		const getConversations = async () => {
			setLoading(true);
			try {
				const res = await fetch("/api/v1.0/messages/sbp");

				if (res.status === 500) {
					throw new Error("Internal Server Error");
				}

				const data = await res.json();

				if (!res.ok || data.success === false)
					throw new Error(data.msg || "Failed To Load Conversations");

				setConversations(data.data);
			} catch (error) {
				toast.error(error);
				throw new Error(error);
			} finally {
				setLoading(false);
			}
		};

		getConversations();
	}, []);

	return { loading, conversations };
};

export default useGetConversations;
