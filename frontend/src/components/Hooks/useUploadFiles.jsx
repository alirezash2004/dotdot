import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import toast from "react-hot-toast";

const useUploadFiles = () => {
	const [isUploaded, setIsUploaded] = useState(false);

	const {
		mutateAsync: uploadImg,
		isPending: isUploaing,
		isError: isUploadError,
		error: uploadError,
		reset,
	} = useMutation({
		mutationFn: async (file) => {
			try {
				const formData = new FormData();
				formData.append("postImage", file);

				const res = await fetch(`/api/v1.0/postMedia/upload/singleImage`, {
					method: "POST",
					body: formData,
				});
				const data = await res.json();

				if (!res.ok || data.success === false)
					throw new Error(data.msg || "Failed To Upload");

				return { fileAccesstoken: data.fileAccesstoken };
			} catch (error) {
				throw new Error(error);
			}
		},
		onSuccess: (returnData) => {},
		onError: (error) => {
			toast.error("Failed To Upload Files");
		},
		retry: 3,
	});

	const upload = async (files) => {
		try {
			const tokens = [];
			for (const file of files) {
				const data = await uploadImg(file.file);
				if (isUploadError) {
					throw new Error(uploadError);
				}
				tokens.push(data.fileAccesstoken);
				reset();
			}
			setIsUploaded(true);
			return tokens;
		} catch (error) {
			setIsUploaded(false);
			return [];
		}
	};

	return {
		isUploadError,
		uploadError,
		upload,
		isUploaing,
		isUploaded,
		setIsUploaded
	};
};

export default useUploadFiles;
