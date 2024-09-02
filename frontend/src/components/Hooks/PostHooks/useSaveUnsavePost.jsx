import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

const useSaveUnsavePost = ({ postId, setIsSaved }) => {
	const { mutate: saveUnsavePost, isPending: isSaveUnsavePending } =
		useMutation({
			mutationFn: async () => {
				const res = await fetch(`/api/v1.0/posts/save/${postId}`, {
					method: "POST",
				});
				const data = await res.json();

				if (!res.ok || data.success === false)
					throw new Error(data.msg || "Failed To Save/Unsave post");

				return data.data;
			},
			onSuccess: (returnData) => {
				setIsSaved(returnData.isSaved);
			},
			onError: (error) => {
				toast.error(error.message);
			},
		});

	return {
		saveUnsavePost,
		isSaveUnsavePending,
	};
};

export default useSaveUnsavePost;
