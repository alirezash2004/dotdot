import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import toast from "react-hot-toast";

const useGetFollowingRelations = ({ targetPageId }) => {
	const [skip, setSkip] = useState(0);
	const [followingRelationType, setFollowingRelationType] =
		useState("followers");

	const { data, isFetching, refetch } = useQuery({
		queryKey: ["getFollowingRelation"],
		queryFn: async () => {
			try {
				const res = await fetch(
					followingRelationType === "followers"
						? `/api/v1.0/followingRelationships/followers/${targetPageId}?skip=${skip}`
						: `/api/v1.0/followingRelationships/followings/${targetPageId}?skip=${skip}`
				);
				const data = await res.json();

				if (!res.ok || data.success === false)
					throw new Error(data.msg || `Failed to get ${followingRelationType}`);

				setSkip((prevData) => prevData + 10);

				return data.data;
			} catch (error) {
				toast.error(error.message);
			}
		},
		enabled: false,
	});

	const delay = (ms) => {
		return new Promise((resolve) => {
			setTimeout(resolve, ms);
		});
	};

	const changeFollowingRelationType = (type) => {
		setFollowingRelationType(type);
		setSkip(0);
	};

	const reset = async () => {
		setSkip(0);
		await delay(100);
	};

	// const fetchFollowingRelation = async () => {};

	return {
		followingRelationData: { relationType: followingRelationType, data: data },
		isFollowingRelationLoading: isFetching,
		fetchFollowingRelation: refetch,
		changeFollowingRelationType,
		reset,
	};
};

export default useGetFollowingRelations;
