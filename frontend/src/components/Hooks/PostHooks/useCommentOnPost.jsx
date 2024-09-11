import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const useCommentOnPost = ({
	postId,
	postType,
	setComment,
	commentBox,
	postCommentsArr,
}) => {
	const queryClient = useQueryClient();

	const { mutate: commentOnPost, isPending: isCommentPending } = useMutation({
		mutationFn: async (comment) => {
			try {
				const res = await fetch(`/api/v1.0/posts/comment/${postId}`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ text: comment }),
				});

				if (res.status === 500) {
					throw new Error("Internal Server Error");
				}

				const data = await res.json();

				if (!res.ok || data.success === false)
					throw new Error(data.msg || "Failed To Comment On This Post");

				return data.data.comment;
			} catch (error) {
				throw new Error(error);
			}
		},
		onSuccess: (returnData) => {
			// console.log(returnData);
			toast.success("Commented On Post Successfully");
			setComment("");
			document.querySelector("#commentInp").value = "";

			if (postType !== "single") {
				queryClient.setQueryData(["posts"], (oldData) => {
					return oldData.map((p) => {
						if (p._id === postId) {
							// console.log(p);

							return {
								...p,
								comments: [...p.comments, returnData],
							};
						}
						return p;
					});
				});
			} else {
				postCommentsArr.push(returnData);
			}

			setTimeout(() => {
				let comments = commentBox.current.children;

				comments[comments.length - 1].scrollIntoView({
					behavior: "smooth",
					block: "end",
				});
			}, 100);
		},
		onError: (error) => {
			toast.error(`failed to post comment. ${error.message}`);
		},
	});

	return {
		commentOnPost,
		isCommentPending,
	};
};

export default useCommentOnPost;
