const NewpostCaption = ({ isUploaing, isPosting, caption, setCaption }) => {
	return (
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
	);
};

export default NewpostCaption;
