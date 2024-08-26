import { useQuery } from "@tanstack/react-query";

import Post from "./Post";
import PostSkeleton from "../skeletons/PostSkeleton";
import { CiCirclePlus } from "react-icons/ci";
import { useEffect, useRef, useState } from "react";
import Loading from "./Loading";

const Posts = () => {
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
	} = useQuery({
		queryKey: ["posts"],
		queryFn: async () => {
			try {
				if (isLoadingNewPosts) {
					return [];
				}
				setIsLoadingNewPosts(true);

				const res = await fetch(`/api/v1.0/posts/recent?skip=${skip}`);
				const data = await res.json();

				if (!res.ok || data.success === false)
					throw new Error(data.msg || "Failed To Fetch Posts!");

				setTotalPosts((prevData) => [...prevData, ...data.posts]);
				setSkip((prevData) => prevData + 10);

				if (data.posts.length === 0) {
					setDisabledLoading(true);
				}

				setIsLoadingNewPosts(false);
				return [...totalPosts, ...data.posts];
			} catch (error) {
				// toast.error(error.message);
				throw new Error(error);
			}
		},
	});

	useEffect(() => {
		if (disabledLoading) {
			return;
		}

		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting) {
					refetch();
					// queryClinet.invalidateQueries(
					// 	{ queryKey: ["posts"] },
					// 	{ cancelRefetch: false }
					// );
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
			<div className="flex flex-[4_4_0] flex-col pt-10">
				{!isLoading &&
					!isFetching &&
					!isLoadingNewPosts &&
					totalPosts?.length === 0 && (
						<p className="text-center my-4">OOPS! No Posts Found!</p>
					)}
				{!isLoading && posts && (
					<>
						{posts.map((post) => (
							<Post key={post._id} post={post} />
						))}
					</>
				)}

				{(isLoading || isFetching || isLoadingNewPosts) && (
					<div className="flex flex-col gap-16 mx-auto">
						<PostSkeleton />
						<PostSkeleton />
						<PostSkeleton />
					</div>
				)}
				{!disabledLoading && (
					<div ref={observerTarget} className="flex mx-auto pt-20 pb-20">
						{(isLoading || isFetching) && <Loading size="lg" />}
						{!(isLoading || isFetching || isLoadingNewPosts) && (
							<CiCirclePlus className="text-6xl" />
						)}
					</div>
				)}
			</div>
		</>
	);
};

export default Posts;
