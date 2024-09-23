const NewPostSteps = ({
	filesLength,
	isPosting,
	posted,
	isUploaded,
	isUploaing,
}) => {
	return (
		<ul className="steps w-full mx-auto my-3">
			<li
				className={`step ${
					posted
						? "step-primary"
						: filesLength !== 0
						? "step-primary"
						: "step-secondary"
				}`}
			>
				Select
			</li>
			<li
				className={`step ${
					posted ? "step-primary" : filesLength !== 0 ? "step-primary" : ""
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
	);
};

export default NewPostSteps;
