import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { CiCirclePlus } from "react-icons/ci";

import ProfilePostsSkeleton from "../../components/skeletons/ProfilePostsSkeleton";
import Loading from "../../components/common/Loading";

import Post from "../../components/common/Post";

const Posts = ({ pageUsername = "" }) => {
	const [skip, setSkip] = useState(0);
	const [totalPosts, setTotalPosts] = useState([]);
	const [isLoadingNewPosts, setIsLoadingNewPosts] = useState(false);
	const [disabledLoading, setDisabledLoading] = useState(false);
	const observerTarget = useRef(null);

	const {
		data: posts,
		isLoading,
		refetch,
		isFetching,
		isPending,
	} = useQuery({
		queryKey: ["profilePosts"],
		queryFn: async () => {
			if (isLoadingNewPosts) {
				return [];
			}
			setIsLoadingNewPosts(true);
			try {
				const res = await fetch(
					`/api/v1.0/posts/page/${pageUsername}?skip=${skip}`
				);
				const data = await res.json();

				if (!res.ok || data.success === false)
					throw new Error(data.msg || "Failed To Fetch Posts!");

				setTotalPosts((prevData) => [...prevData, ...data.posts]);
				setSkip((prevData) => prevData + 10);

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
	});

	// const queryClient = useQueryClient();
	// useEffect(() => {
	// 	setDisabledLoading(false);
	// 	setSkip(0);
	// 	setTotalPosts([]);
	// 	// refetch();
	// 	queryClient.invalidateQueries({ queryKey: ["posts"] });
	// 	// setIsLoadingNewPosts(true);
	// 	// }, [pageUsername, refetch]);
	// }, [pageUsername, queryClient]);

	useEffect(() => {
		if (disabledLoading) {
			return;
		}

		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting) {
					// fetchData();
					console.log("b");

					refetch();
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
			{!isLoading &&
				!isFetching &&
				!isLoadingNewPosts &&
				!isPending &&
				totalPosts?.length === 0 && (
					<p className="text-center my-4">OOPS! No Posts Found!</p>
				)}
			{!isLoading && posts && (
				<div className="grid grid-cols-2 md:grid-cols-3">
					{totalPosts.map((post) => (
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
		</>
	);
};

export default Posts;
