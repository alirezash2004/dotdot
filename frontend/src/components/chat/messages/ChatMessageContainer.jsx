import { CiSquareAlert, CiSquareChevLeft } from "react-icons/ci";
import ChatMessages from "./ChatMessages";
import ChatMessageInput from "./ChatMessageInput";

const NoChatSelected = () => {
	return (
		<div className="hidden md:flex flex-col items-center justify-center w-full h-full gap-5 text-xl">
			<CiSquareAlert className="text-5xl" />
			<p>There is no chat selected</p>
			<p>Select a converasion</p>
		</div>
	);
};

const ChatMessageContainer = () => {
	const noChatSelected = true;
	return (
		<div className="md:min-w-[450px] flex-[4_4_0] flex flex-col w-screen md:w-auto max-h-screen z-30 pb-20 md:pb-0">
			{noChatSelected ? (
				<NoChatSelected />
			) : (
				<>
					{/* header */}
					<div className="bg-slate-500 px-4 py-2 mb-2 pb sticky top-0 z-50">
						<span className="text-3xl pr-2 md:hidden hover:scale-150 inline-flex transition-all relative top-[2px]">
							<CiSquareChevLeft className="inline-flex" />
						</span>
						<span className="label-text relative -top-2 md:top-0">To: </span>
						<span className="text-gray-900 font-bold relative -top-2 md:top-0">
							John Doe
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
