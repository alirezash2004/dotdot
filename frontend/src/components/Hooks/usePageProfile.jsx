import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

export function usePageProfile({
	username,
	isMyProfile,
	authPageId,
	disable = false,
}) {
	const [isPageFetched, setIsPageFetched] = useState(false);
	const [isFollowing, setIsFollowing] = useState(false);

	const {
		data: targetPage,
		isPending: isTargetPagePending,
		isFetching: isTargetPageFetching,
		refetch: fetchPage,
	} = useQuery({
		queryKey: ["pageprofile"],
		queryFn: async () => {
			setIsPageFetched(false);

			const res = await fetch(`/api/v1.0/pages/${username}`);
			const data = await res.json();

			if (!res.ok || data.success === false)
				throw new Error(data.msg || "Failed To Fetch Page!");

			setIsPageFetched(true);

			return data.data;
		},
		enabled: disable ? false : true,
	});

	const {
		isPending: isFollowingReltaionPending,
		isFetching: isFollowingReltaionFetching,
		refetch: fetchRelation,
	} = useQuery({
		queryKey: ["followingRelation"],
		queryFn: async () => {
			const res = await fetch(
				`/api/v1.0/followingRelationships?pageId=${authPageId}&followedPageId=${targetPage._id}`
			);
			const data = await res.json();

			if (!res.ok || data.success === false)
				throw new Error(data.msg || "Failed To Fetch FollowingRelationShip!");

			setIsFollowing(data.isFollowing);

			return data;
		},
		enabled: isTargetPageFetching ? false : true,
	});

	const fetchProfilePage = async () => {
		await fetchPage();
		await fetchRelation();
	};

	const fetchPageOnly = async () => {
		await fetchPage();
	};

	return {
		isFetching:
			isTargetPagePending ||
			isTargetPageFetching ||
			isFollowingReltaionPending ||
			isFollowingReltaionFetching,
		isFollowing: isFollowing,
		targetPage: targetPage,
		fetchProfilePage,
		fetchPageOnly,
	};
}
