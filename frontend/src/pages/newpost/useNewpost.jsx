import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

const useNewpost = ({
	setCaption,
	setFiles,
	setFileTokens,
	setPosted,
	imgRef,
}) => {
	const { mutate: Post, isPending: isPosting } = useMutation({
		mutationFn: async ({ fileAccesstoken, caption }) => {
			try {
				const res = await fetch(`/api/v1.0/posts/create`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						assetType: "picture",
						caption: caption !== "" ? caption : " ",
						postmedia: {
							mediaAccessTokens: [...fileAccesstoken],
						},
					}),
				});

				if (res.status === 500) {
					throw new Error("Internal Server Error");
				}

				const data = await res.json();

				if (!res.ok || data.success === false)
					throw new Error(data.msg || "Failed To Create New Post");

				return data;
			} catch (error) {
				throw new Error(error);
			}
		},
		onSuccess: () => {
			toast.success("post uploaded successfully");
			setCaption("");
			setFiles([]);
			setFileTokens([]);
			imgRef.current.value = "";
			setPosted(true);
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});

	return {
		newpost: Post,
		isPosting,
	};
};

export default useNewpost;
