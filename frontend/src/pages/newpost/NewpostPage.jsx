import { useMutation } from "@tanstack/react-query";
import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { Helmet } from "react-helmet-async";

import { CiMedicalCross, CiMountain1 } from "react-icons/ci";

const NewpostPage = () => {
	const imgRef = useRef(null);
	const [img, setImg] = useState(null);
	const [file, setFile] = useState(null);
	const [isDragging, setIsDragging] = useState(false);
	const [fileToken, setFileToken] = useState("");
	const [caption, setCaption] = useState("");
	const [posted, setPosted] = useState(false);

	const { mutate: uploadImg, isPending: isUploaing } = useMutation({
		mutationFn: async ({ file, caption }) => {
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

				return { fileAccesstoken: data.fileAccesstoken, caption };
			} catch (error) {
				throw new Error(error);
			}
		},
		onSuccess: (returnData) => {
			setFileToken(returnData.fileAccesstoken);
			Post({
				fileAccesstoken: returnData.fileAccesstoken,
				caption: returnData.caption,
			});
		},

		onError: (error) => {
			toast.error(error.message);
			setFileToken(null);
		},
	});

	const { mutate: Post, isPending: isPosting } = useMutation({
		mutationFn: async ({ fileAccesstoken, caption }) => {
			const res = await fetch(`/api/v1.0/posts/create`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					type: "single",
					assetType: "picture",
					caption: caption !== "" ? caption : " ",
					postmedia: {
						mediaAccessTokens: [fileAccesstoken],
					},
				}),
			});
			const data = await res.json();

			if (!res.ok || data.success === false)
				throw new Error(data.msg || "Failed To Create New Post");

			return data;
		},
		onSuccess: () => {
			toast.success("post uploaded successfully");
			setFileToken(null);
			setCaption("");
			setImg("");
			setFile(null);
			imgRef.current.value = "";
			setPosted(true);
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});

	const handlePostUpload = async () => {
		if (isUploaing) return;
		if (fileToken) {
			Post({
				fileAccesstoken: fileToken,
				caption: caption,
			});
		} else {
			uploadImg({ file, caption });
		}
	};

	const handleImageChange = (file) => {
		if (file) {
			const reader = new FileReader();
			reader.onload = () => {
				setImg(reader.result);
				setFile(file);
				setPosted(false);
			};
			// reader.readAsArrayBuffer(file);
			reader.readAsDataURL(file);
		}
	};

	const handleOndragOut = (e) => {
		e.preventDefault();
		setIsDragging(false);
	};

	const handleOndragOver = (e) => {
		e.preventDefault();
		setIsDragging(true);
	};

	const handleOndrop = (e) => {
		e.preventDefault();
		e.stopPropagation();
		setIsDragging(false);
		handleImageChange(e.dataTransfer.files[0]);
	};

	return (
		<>
			<Helmet>
				<title>NewPost - DotDot Social Media</title>
			</Helmet>
			<div className="flex-[4_4_0] border-r border-gray-700 min-h-screen pb-32">
				<div className="w-full text-start text-xl pt-3 px-5">
					<div className="flex items-center gap-2">
						<CiMountain1 /> New Post
					</div>
				</div>
				<ul className="steps w-full mx-auto my-3">
					<li
						className={`step ${
							posted ? "step-primary" : img ? "step-primary" : "step-secondary"
						}`}
					>
						Select
					</li>
					<li
						className={`step ${
							posted ? "step-primary" : img ? "step-primary" : ""
						}`}
					>
						Ready
					</li>
					<li
						className={`step ${(fileToken || posted) && "step-primary"} ${
							isUploaing && "step-secondary"
						}`}
					>
						Uploaded
					</li>
					<li
						className={`step ${posted && "step-primary"} ${
							isPosting && "step-secondary"
						}`}
					>
						Posted
					</li>
				</ul>
				<div className="w-full flex items-center justify-center mt-7">
					{!img && (
						<div
							className={`border text-center border-dashed px-6 py-12 w-2/5 aspect-square flex items-center justify-center cursor-pointer rounded-md transition-all select-none ${
								isDragging ? "scale-125 text-blue-500 border-blue-500" : ""
							}`}
							onClick={() => {
								imgRef.current.click();
							}}
							onDragOver={handleOndragOver}
							onDragLeave={handleOndragOut}
							onDragExit={handleOndragOut}
							onDrop={handleOndrop}
						>
							{!isDragging && <span>Select Image Or Drop Here</span>}
							{isDragging && <span>Drop Image Here</span>}
						</div>
					)}
					{img && (
						<div className="relative">
							<div
								className="flex items-center absolute -top-6 -right-6 cursor-pointer text-red-700 bg-slate-900 p-2 rounded-full w-12 h-12 btn-outline btn-square btn"
								onClick={() => {
									if (isUploaing || isPosting) return;
									setImg("");
									setFile(null);
									imgRef.current.value = "";
									setPosted(false);
								}}
							>
								<CiMedicalCross className="rotate-45 w-6 h-6" />
							</div>
							<img
								src={img}
								alt=""
								className="max-w-40 md:max-w-96 rounded-md"
							/>
						</div>
					)}
					<div></div>
				</div>
				<input
					type="file"
					accept="image/*"
					hidden
					ref={imgRef}
					onChange={(e) => handleImageChange(e.target.files[0])}
				/>
				<div className="flex w-11/12 items-center justify-center mx-auto mt-10">
					<textarea
						className={`textarea w-full text-lg resize-none focus:outline-none border border-gray-700 mx-auto flex h-52 ${
							isUploaing || isPosting ? "disabled" : ""
						}`}
						value={caption}
						placeholder="Caption"
						onChange={(e) => setCaption(e.target.value)}
					></textarea>
				</div>
				<div className="w-full flex items-center mt-4">
					<button
						className={`w-32 h-16 btn btn-primary px-8 py-5 mx-auto ${
							!img || isUploaing || isPosting ? "btn-disabled" : ""
						}`}
						onClick={handlePostUpload}
					>
						{isUploaing && <span>Uploading Image ...</span>}
						{isPosting && <span>Posting ...</span>}
						{!isUploaing && !isPosting && <span>Post</span>}
					</button>
				</div>
			</div>
		</>
	);
};

export default NewpostPage;
