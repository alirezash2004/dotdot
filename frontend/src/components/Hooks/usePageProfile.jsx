import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";

export function usePageProfile({
	username,
	isValidUsername,
	isMyProfile,
	authPageId,
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
		// enabled: false,
		// enabled: !isMyProfile && isValidUsername,
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
		// enabled: false,
		enabled:
			isPageFetched &&
			!isMyProfile &&
			!isTargetPageFetching &&
			!isTargetPagePending,
	});

	const fetchProfilePage = async () => {
		await fetchPage();
		await fetchRelation();
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
	};
}
