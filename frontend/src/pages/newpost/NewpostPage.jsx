import { useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import toast from "react-hot-toast";

import HorizontalScrollCarousel from "../../components/common/HorizontalScrollCarousel";

import useUploadFiles from "../../components/Hooks/useUploadFiles";

import { CiMountain1 } from "react-icons/ci";
import useNewpost from "./useNewpost";

const NewpostPage = () => {
	const imgRef = useRef(null);

	const [files, setFiles] = useState([]);

	const [isDragging, setIsDragging] = useState(false);
	const [caption, setCaption] = useState("");
	const [posted, setPosted] = useState(false);
	const [fileTokens, setFileTokens] = useState([]);

	const { upload, isUploadError, isUploaing, isUploaded, setIsUploaded } =
		useUploadFiles({ destination: "singlePic" });

	const { newpost, isPosting } = useNewpost({
		imgRef,
		setCaption,
		setFiles,
		setFileTokens,
		setPosted,
	});

	const handlePostUpload = async () => {
		if (isUploaing) return;
		setPosted(false);
		let UploadedfileTokens;
		if (fileTokens.length === files.length) {
			console.log("use", fileTokens);
			UploadedfileTokens = fileTokens;
		} else {
			console.log("nouse");
			UploadedfileTokens = await upload(files);
			if (isUploadError) return;
		}
		newpost({
			fileAccesstoken: UploadedfileTokens,
			caption: caption,
		});
	};

	const handleImageChange = (fileList) => {
		if (fileList.length > 5) {
			toast.error("You Can Only Select a maximum of 5 Files");
			return;
		}
		if (fileList.length !== 0) {
			setIsUploaded(false);
			setPosted(false);
			const newFiles = [];

			for (const fl of fileList) {
				newFiles.push({ file: fl, blob: URL.createObjectURL(fl) });
			}

			setFiles(newFiles);
			setFileTokens([]);
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
		handleImageChange(e.dataTransfer.files);
	};

	const handleDeleteImage = (fileToDelete) => {
		if (isUploaing || isPosting) return;
		const findIndex = files.indexOf(fileToDelete);
		setFiles((prevData) => prevData.filter((item, idx) => idx !== findIndex));
		setFileTokens([]);
		setPosted(false);

		setTimeout(() => {
			if (files.length === 0) imgRef.current.value = "";
		}, 100);
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
							posted
								? "step-primary"
								: files.length !== 0
								? "step-primary"
								: "step-secondary"
						}`}
					>
						Select
					</li>
					<li
						className={`step ${
							posted ? "step-primary" : files.length !== 0 ? "step-primary" : ""
						}`}
					>
						Ready
					</li>
					<li
						className={`step ${(isUploaded || posted) && "step-primary"} ${
							isUploaing && "step-secondary"
						}`}
					>
						Uploading
					</li>
					<li className={`step ${(isUploaded || posted) && "step-primary"}`}>
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
					{(!files || files.length === 0) && (
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
							{!isDragging && (
								<span>
									Select Image{" "}
									<span className="hidden md:inline-flex">Or Drop Here</span>
								</span>
							)}
							{isDragging && <span>Drop Image Here</span>}
						</div>
					)}
					{files.length !== 0 && (
						<HorizontalScrollCarousel
							className="relative"
							handleDeleteImage={handleDeleteImage}
							imgs={files}
						/>
					)}
					<div></div>
				</div>
				<input
					type="file"
					accept=".png,.jpeg,.jpg"
					hidden
					multiple
					ref={imgRef}
					onChange={(e) => handleImageChange(e.target.files)}
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
							!files || files.length === 0 || isUploaing || isPosting
								? "btn-disabled"
								: ""
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
