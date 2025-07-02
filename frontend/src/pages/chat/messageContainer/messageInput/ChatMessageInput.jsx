import { useState } from "react";

import useConversation from "../../../../zustand/useConversation";

import useSendMessage from "../../../../components/Hooks/useSendMessage";

import Loading from "../../../../components/common/Loading";

import { CiFaceSmile, CiPaperplane } from "react-icons/ci";

import EmojiPicker from "emoji-picker-react";

const ChatMessageInput = () => {
	const { selectedConversation } = useConversation();
	const [message, setMessage] = useState("");
	const { isLoading, sendMessage } = useSendMessage();
	const [openEmoji, setOpenEmoji] = useState(false);

	const handleSendMessage = async (e) => {
		e.preventDefault();
		setMessage(message.trim());
		setOpenEmoji(false);
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
			className="px-4 mt-4 py-4 z-50 sticky w-full bg-slate-800 bottom-0"
			onSubmit={handleSendMessage}
		>
			<div className="w-full relative mb-2">
				<input
					type="text"
					className="border text-sm block w-full p-2.5 bg-gray-300 dark:bg-gray-700 border-gray-600 dark:text-white outline-none"
					style={{ borderRadius: "20px" }}
					placeholder="Send a message"
					value={message}
					onChange={(e) => setMessage(e.target.value)}
				/>
				<button
					type="button"
					onClick={() => setOpenEmoji((prev) => !prev)}
					className="absolute inset-y-0 end-10 flex items-center pe-3"
				>
					<CiFaceSmile />
				</button>
				<button
					type="submit"
					className="absolute inset-y-0 end-0 flex items-center pe-3"
				>
					{isLoading ? <Loading /> : <CiPaperplane />}
				</button>
			</div>
			<EmojiPicker
				onEmojiClick={(e) => setMessage((prev) => prev + e.emoji)}
				open={openEmoji}
				onClose={() => setOpenEmoji(false)}
				skinTonesDisabled={true}
				suggestedEmojisMode="recent"
				theme="dark"
				width="100%"
				height="300px"
				previewConfig={{ showPreview: false }}
				autoFocusSearch={false}
				style={{ borderRadius: "20px" }}
			/>
		</form>
	);
};
export default ChatMessageInput;
