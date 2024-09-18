import { useEffect } from "react";

import ChatMessages from "./ChatMessages";
import ChatMessageInput from "./ChatMessageInput";

import useConversation from "../../../zustand/useConversation";

import { CiSquareAlert, CiSquareChevLeft } from "react-icons/ci";

const NoChatSelected = () => {
	return (
		<div className="hidden md:flex flex-col items-center justify-center w-full h-full gap-5 text-xl">
			<CiSquareAlert className="text-5xl" />
			<p>There is no chat selected</p>
			<p>Select a conversation</p>
		</div>
	);
};

const ChatMessageContainer = () => {
	const { selectedConversation, setSelectedConversation } = useConversation();

	useEffect(() => {
		return () => {
			setSelectedConversation(null);
		};
	}, [setSelectedConversation]);

	return (
		<div className="md:min-w-[450px] md:flex-[4_4_0] flex flex-col w-screen md:w-auto h-[94vh] md:h-screen z-30 pb-20 md:pb-0">
			{!selectedConversation ? (
				<NoChatSelected />
			) : (
				<>
					{/* header */}
					<div className="bg-slate-500 px-4 py-2 mb-2 pb sticky top-0 z-50">
						<span
							className="text-3xl pr-2 md:hidden hover:scale-150 inline-flex transition-all relative top-[2px]"
							onClick={() => setSelectedConversation(null)}
						>
							<CiSquareChevLeft className="inline-flex" />
						</span>
						<span className="label-text relative -top-2 md:top-0">To: </span>
						<span className="text-gray-900 font-bold relative -top-2 md:top-0">
							{selectedConversation.fullName}
						</span>
					</div>

					{/* messages */}
					<ChatMessages />
					<ChatMessageInput />
				</>
			)}
		</div>
	);
};

export default ChatMessageContainer;
