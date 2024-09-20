import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";

const useGetConversations = () => {
	const { data, refetch, isFetching } = useQuery({
		queryKey: ["chatConversations"],
		queryFn: async () => {
			try {
				const res = await fetch("/api/v1.0/messages/sbp");

				if (res.status === 500) {
					throw new Error("Internal Server Error");
				}

				const data = await res.json();

				if (!res.ok || data.success === false)
					throw new Error(data.msg || "Failed To Load Conversations");
				
				return data.data;
			} catch (error) {
				toast.error(error.message);
				throw new Error(error);
			}
		},
	});

	return { loading: isFetching, conversations: data };
};

export default useGetConversations;
