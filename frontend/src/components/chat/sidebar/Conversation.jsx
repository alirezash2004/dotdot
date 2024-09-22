import { useNavigate } from "react-router-dom";
import { useSocketContext } from "../../../context/useSocketContext.jsx";
import changeHost from "../../../utils/changeHost.js";

import useConversation from "../../../zustand/useConversation.jsx";

const Converasion = ({ conversation, lastIdx }) => {
	const navigate = useNavigate();
	const { selectedConversation, setSelectedConversation } = useConversation();

	const isSelected =
		selectedConversation?.participants[0]._id === conversation._id;

	const { onlinePages } = useSocketContext();
	const isOnline = onlinePages.includes(conversation.participants[0]._id);

	const targetPage = conversation?.participants[0];

	const hasUnreadMessage =
		conversation.lastMessage.from === targetPage._id &&
		conversation.lastMessage.read === false;

	return (
		<>
			<div
				className={`flex gap-3 items-center hover:bg-accent hover:text-black transition-all duration-300 rounded p-2 py-3 cursor-pointer ${
					isSelected && "bg-accent text-black"
				}`}
				onClick={() => {
					setSelectedConversation(conversation);
					navigate(`/chat/${targetPage.username}`);
				}}
			>
				<div className={`avatar ${isOnline ? "online" : "offline"}`}>
					<div className="w-10 rounded-full">
						<img src={changeHost(targetPage.profilePicture)} alt="Avatar" />
					</div>
				</div>
				<div className="flex flex-col flex-1">
					<div
						className={`flex gap-3 justify-between relative ${
							hasUnreadMessage && "pr-10"
						}`}
					>
						<p className="text-sm font-bold">{targetPage.fullName}</p>
						<span className="text-slate-500 truncate">
							{conversation.lastMessage.message?.text || ""}
							{conversation.lastMessage.message?.post ? <span className="text-primary">Post</span> : ""}
						</span>
						{hasUnreadMessage && (
							<span className="flex w-3 h-3 bg-primary rounded-full absolute right-4 top-1/2 -translate-y-1/2"></span>
						)}
					</div>
				</div>
			</div>

			{!lastIdx && <div className="divider my-0 py-0 h-1" />}
		</>
	);
};

export default Converasion;
