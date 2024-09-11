import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const useLikeUnlikePost = ({
	postId,
	postType,
	setNumberOfLikes,
	setIsLiked,
}) => {
	const queryClient = useQueryClient();

	const { mutate: likeUnlikePost, isPending: isLikeUnlikePending } =
		useMutation({
			mutationFn: async () => {
				try {
					const res = await fetch(`/api/v1.0/posts/like/${postId}`, {
						method: "POST",
					});

					if (res.status === 500) {
						throw new Error("Internal Server Error");
					}

					const data = await res.json();

					if (!res.ok || data.success === false)
						throw new Error(data.msg || "Failed To Like/Unlike");

					return data.data;
				} catch (error) {
					throw new Error(error);
				}
			},
			onSuccess: (returnData) => {
				setNumberOfLikes(returnData.numberOfLikes);
				setIsLiked(returnData.isLiked);

				if (postType !== "single") {
					queryClient.setQueryData(["posts"], (oldData) => {
						return oldData.map((p) => {
							if (p._id === postId) {
								return {
									...p,
									isLiked: returnData.isLiked,
									numberOfLikes: returnData.numberOfLikes,
								};
							}
							return p;
						});
					});
				}
			},
			onError: (error) => {
				toast.error(`Failed To Like/Unlike Post! ${error.message}`);
			},
		});

	return {
		likeUnlikePost,
		isLikeUnlikePending,
	};
};

export default useLikeUnlikePost;
