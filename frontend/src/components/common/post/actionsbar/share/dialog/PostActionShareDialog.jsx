import toast from "react-hot-toast";

import useSendMessage from "../../../../../Hooks/useSendMessage";

import changeHost from "../../../../../../utils/changeHost.js";

import Loading from "../../../../Loading";

const PostActionsShareDialog = ({
	post,
	sharePostTarget,
	setSharePostTarget,
	conversations,
}) => {
	const postId = post._id;

	const { isLoading: isSendingMessage, sendMessage } = useSendMessage();
	const handleSendpost = async (e) => {
		e.preventDefault();
		if (isSendingMessage) return;

		if (!sharePostTarget) return toast.error("You have to select a page");

		await sendMessage({
			message: { post: post._id },
			to: sharePostTarget,
		});

		document.querySelector(`#sharepost_modal_close_${postId}`).click();
	};

	return (
		<dialog
			id={`sharepost_modal_${postId}`}
			className="modal border-none outline-none"
		>
			<div className="modal-box rounded border border-gray-700">
				<h3 className="font-bold text-lg mb-4">Share Post</h3>

				<form className="overflow-x-auto">
					{/* <label className="input input-bordered flex items-center gap-2  mb-2">
    Search
    <input type="text" className="grow" placeholder="..." />
</label> */}
					<table className="table">
						<tbody>
							{conversations &&
								conversations.map((conversation, idx) => (
									<tr key={idx}>
										<th>
											<label>
												<input
													type="radio"
													name={`sharepost_radio_${postId}`}
													className="radio"
													id={`sharepost_radio_${postId}_${conversation.participants[0]._id}`}
													onChange={() => {
														setSharePostTarget(
															conversation.participants[0]._id
														);
													}}
												/>
											</label>
										</th>
										<td
											className="flex-1 relative -left-10 cursor-pointer"
											onClick={() => {
												document
													.querySelector(
														`#sharepost_radio_${postId}_${conversation.participants[0]._id}`
													)
													.click();
											}}
										>
											<div className="flex items-center gap-3">
												<div className="avatar">
													<div className="mask mask-squircle h-12 w-12">
														<img
															src={changeHost(
																conversation.participants[0].profilePicture
															)}
															alt="Page Profile"
														/>
													</div>
												</div>
												<div>
													<div className="font-bold">
														{conversation.participants[0].fullName}
													</div>
													<div className="text-sm opacity-50">
														{conversation.participants[0].username}
													</div>
												</div>
											</div>
										</td>
									</tr>
								))}
						</tbody>
					</table>
					<button
						className={`btn btn-secondary w-full rounded-full mt-4 ${
							isSendingMessage && "bg-opacity-75"
						}`}
						onClick={handleSendpost}
					>
						{isSendingMessage && <Loading size="sm" />}
						{!isSendingMessage && "Send"}
					</button>
				</form>
			</div>
			<form method="dialog" className="modal-backdrop">
				<button id={`sharepost_modal_close_${postId}`} className="outline-none">
					close
				</button>
			</form>
		</dialog>
	);
};

export default PostActionsShareDialog;
