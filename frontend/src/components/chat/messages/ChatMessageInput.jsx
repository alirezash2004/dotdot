import { useState } from "react";

import useSendMessage from "../../Hooks/useSendMessage";

import Loading from "../../common/Loading";

import { CiPaperplane } from "react-icons/ci";
import useConversation from "../../../zustand/useConversation";

const ChatMessageInput = () => {
	const { selectedConversation } = useConversation();
	const [message, setMessage] = useState("");
	const { isLoading, sendMessage } = useSendMessage();

	const handleSendMessage = async (e) => {
		e.preventDefault();
		if (!message || message.length === 0) {
			return;
		}
		await sendMessage({
			message: { text: message },
			to: selectedConversation?.participants[0]._id,
		});
		setMessage("");
	};

	return (
		<form
			className="px-4 my-3 sticky bottom-0 mt-auto"
			onSubmit={handleSendMessage}
		>
			<div className="w-full relative">
				<input
					type="text"
					className="border text-sm rounded-lg block w-full p-2.5  bg-gray-700 border-gray-600 text-white"
					placeholder="Send a message"
					value={message}
					onChange={(e) => setMessage(e.target.value)}
				/>
				<button
					type="submit"
					className="absolute inset-y-0 end-0 flex items-center pe-3"
				>
					{isLoading ? <Loading /> : <CiPaperplane />}
				</button>
			</div>
		</form>
	);
};
export default ChatMessageInput;
