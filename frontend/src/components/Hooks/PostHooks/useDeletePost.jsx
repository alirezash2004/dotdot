import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const useDeletePost = ({ postId }) => {
	const navigate = useNavigate();

	const queryClient = useQueryClient();

	const { mutate: deletePost, isPending: isDeletePending } = useMutation({
		mutationFn: async () => {
			try {
				const res = await fetch(`/api/v1.0/posts/${postId}`, {
					method: "DELETE",
				});
				const data = await res.json();

				if (!res.ok || data.success === false)
					throw new Error(data.msg || "Failed To Delete Post");

				return data;
			} catch (error) {
				throw new Error(error);
			}
		},
		onSuccess: (returnData) => {
			toast.success("Post Deleted Successfully");
			queryClient.invalidateQueries({ queryKey: ["posts"] });
			navigate(`/profile/${returnData.username}`);
		},
		onError: (error) => {
			toast.error(error.message || "Failed To Delete Post!");
			queryClient.invalidateQueries({ queryKey: ["posts"] });
		},
	});

	return {
		deletePost,
		isDeletePending,
	};
};

export default useDeletePost;
