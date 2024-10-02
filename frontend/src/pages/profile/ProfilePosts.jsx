import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { CiCirclePlus, CiLock } from "react-icons/ci";

import ProfilePostsSkeleton from "../../components/skeletons/ProfilePostsSkeleton";
import Loading from "../../components/common/Loading";

import Post from "../../components/common/post/Post";

const Posts = ({
	pageUsername = "",
	postFeedType = "me",
	isMyProfile = false,
}) => {
	const getApi = (postFeedType) => {
		switch (postFeedType) {
			case "me":
				return `/api/v1.0/posts/page/${pageUsername}?skip=`;
			case "saved":
				return `/api/v1.0/posts/saved?skip=`;
			case "liked":
				return `/api/v1.0/posts/likes?skip=`;
			case "recent":
				return `/api/v1.0/posts/recent?skip=`;
		}
	};

	const apiUri = getApi(postFeedType);

	const [skip, setSkip] = useState(0);
	const [totalPosts, setTotalPosts] = useState([]);
	const [isLoadingNewPosts, setIsLoadingNewPosts] = useState(false);
	const [disabledLoading, setDisabledLoading] = useState(false);
	const observerTarget = useRef(null);
	const [isPageAccess, setIsPageAccess] = useState(true);

	const {
		data: posts,
		isLoading,
		refetch,
		isFetching,
		isPending,
	} = useQuery({
		queryKey: ["profilePosts", pageUsername],
		queryFn: async () => {
			if (isLoadingNewPosts) {
				return [];
			}

			setIsLoadingNewPosts(true);
			try {
				const res = await fetch(apiUri + skip.toString());
				const data = await res.json();

				if (data.access === false) {
					setTotalPosts([]);
					setIsPageAccess(false);
					return [];
				}

				if (!res.ok || data.success === false)
					throw new Error(data.msg || "Failed To Fetch Posts!");

				if (skip === 0) {
					setTotalPosts(data.posts);
				} else {
					setTotalPosts((prevData) => [...prevData, ...data.posts]);
				}

				setSkip((prevData) => prevData + 6);
				setIsPageAccess(true);

				if (data.posts.length === 0) {
					setDisabledLoading(true);
				}

				setIsLoadingNewPosts(false);
				return data.posts;
			} catch (error) {
				// toast.error(error.message);
				throw new Error(error);
			}
		},
		enabled: false,
		retry: false,
	});

	useEffect(() => {
		setIsPageAccess(true);
		setDisabledLoading(false);
		setSkip(0);
		setTotalPosts([]);
		setTimeout(() => {
			refetch();
		}, 100);
	}, [postFeedType, setSkip, refetch, isMyProfile]);

	useEffect(() => {
		if (disabledLoading) {
			return;
		}

		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting) {
					setTimeout(() => {
						refetch();
					}, 100);
				}
			},
			{ rootMargin: "50px", threshold: 1.0 }
		);

		if (observerTarget.current) {
			observer.observe(observerTarget.current);
		}

		return () => {
			if (observerTarget.current) {
				observer.unobserve(observerTarget.current);
			}
		};
	}, [observerTarget, refetch, disabledLoading]);

	return (
		<>
			{!isPageAccess ? (
				<div className="flex w-full items-center justify-center h-1/3">
					<div className="flex flex-col gap-3 items-center justify-center px-4 py-12 shadow-2xl rounded-2xl">
						<CiLock className="w-10 h-10 md:w-12 md:h-12" />
						<h3 className="text-xl md:text-3xl">This Page Is Private</h3>
						<h4 className="text-sm text-slate-500">
							You Have To First Follow To See Posts
						</h4>
					</div>
				</div>
			) : (
				<>
					{!isLoading &&
						!isFetching &&
						!isLoadingNewPosts &&
						!isPending &&
						totalPosts?.length === 0 && (
							<p className="text-center my-4">OOPS! No Posts Found!</p>
						)}
					{!isLoading && posts && (
						<div className="grid grid-cols-2 md:grid-cols-3">
							{totalPosts.length !== 0 &&
								totalPosts.map((post) => (
									<Post key={post._id} post={post} postType="pageProfile" />
								))}
						</div>
					)}

					{(isLoading || isFetching || isLoadingNewPosts || isPending) && (
						<ProfilePostsSkeleton />
					)}
					{!disabledLoading && (
						<div
							ref={observerTarget}
							className="flex mx-auto pt-20 pb-20 w-full items-center justify-center"
						>
							{(isLoading || isFetching) && <Loading size="lg" />}
							{!(isLoading || isFetching || isLoadingNewPosts || isPending) && (
								<CiCirclePlus className="text-6xl mt-56" />
							)}
						</div>
					)}

					<div className="h-20 w-full bg-transparent"></div>
				</>
			)}
		</>
	);
};

export default Posts;
