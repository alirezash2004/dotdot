import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";

const useGetConversations = ({ disableOnloadFetch = false }) => {
	const {
		data,
		refetch: fetchConversations,
		isFetching,
	} = useQuery({
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
		enabled: disableOnloadFetch ? false : true,
	});

	return { loading: isFetching, conversations: data, fetchConversations };
};

export default useGetConversations;
