import { useRef, useState } from "react";
import toast from "react-hot-toast";

import SetPageTitle from "../../components/common/SetPageTitle";

import useUploadFiles from "../../components/Hooks/useUploadFiles";

import useNewpost from "./useNewpost";
import NewPostSteps from "./steps/NewPostSteps";
import NewpostTopbar from "./topbar/NewpostTopbar";
import NewpostCaption from "./caption/NewpostCaption";
import NewpostPostBtn from "./postbtn/NewpostPostBtn";
import NewpostAssetsBox from "./assetsbox/NewpostAssetsBox";

const NewpostPage = () => {
	const [files, setFiles] = useState([]);
	const imgRef = useRef(null);

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
			UploadedfileTokens = fileTokens;
		} else {
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

	return (
		<>
			<SetPageTitle title="NewPost - DotDot Social Media" />

			<div className="flex-[4_4_0] border-r border-gray-700 min-h-screen pb-32">
				<NewpostTopbar />

				<NewPostSteps
					filesLength={files.length}
					isPosting={isPosting}
					isUploaded={isUploaded}
					isUploaing={isUploaing}
					posted={posted}
				/>

				<NewpostAssetsBox
					files={files}
					handleImageChange={handleImageChange}
					isUploaing={isUploaing}
					isPosting={isPosting}
					setFiles={setFiles}
					setFileTokens={setFileTokens}
					setPosted={setPosted}
					imgRef={imgRef}
				/>

				<input
					type="file"
					accept=".png,.jpeg,.jpg"
					hidden
					multiple
					ref={imgRef}
					onChange={(e) => handleImageChange(e.target.files)}
				/>

				<NewpostCaption
					isUploaing={isUploaing}
					isPosting={isPosting}
					caption={caption}
					setCaption={setCaption}
				/>

				<NewpostPostBtn
					files={files}
					isUploaing={isUploaing}
					isPosting={isPosting}
					handlePostUpload={handlePostUpload}
				/>
			</div>
		</>
	);
};

export default NewpostPage;
