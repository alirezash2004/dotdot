import changeHost from "../../../utils/changeHost.js";

import useConversation from "../../../zustand/useConversation.jsx";

const Converasion = ({ conversation, lastIdx }) => {
	const { selectedConversation, setSelectedConversation } = useConversation();

	const isSelected = selectedConversation?._id === conversation._id;

	return (
		<>
			<div
				className={`flex gap-3 items-center hover:bg-accent hover:text-black transition-all duration-300 rounded p-2 py-3 cursor-pointer ${
					isSelected && "bg-accent text-black"
				}`}
				onClick={() => setSelectedConversation(conversation)}
			>
				<div className="avatar online">
					<div className="w-10 rounded-full">
						<img src={changeHost(conversation.profilePicture)} alt="Avatar" />
					</div>
				</div>
				<div className="flex flex-col flex-1">
					<div className="flex gap-3 justify-between">
						<p className="text-sm font-bold">{conversation.fullName}</p>
						<span className="text-slate-500">{conversation.username}</span>
					</div>
				</div>
			</div>

			{!lastIdx && <div className="divider my-0 py-0 h-1" />}
		</>
	);
};

export default Converasion;
