import { useState } from "react";
import HorizontalScrollCarousel from "../../../components/common/HorizontalScrollCarousel";

const NewpostAssetsBox = ({
	files,
	handleImageChange,
	isUploaing,
	isPosting,
	setFiles,
	setFileTokens,
	setPosted,
	imgRef,
}) => {
	const [isDragging, setIsDragging] = useState(false);
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
		</div>
	);
};

export default NewpostAssetsBox;
