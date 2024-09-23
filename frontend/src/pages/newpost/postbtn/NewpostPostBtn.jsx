const NewpostPostBtn = ({ files, isUploaing, isPosting, handlePostUpload }) => {
	return (
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
	);
};

export default NewpostPostBtn;
