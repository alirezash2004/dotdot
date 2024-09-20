import Conversations from "./Conversations";
import SearchInput from "./SearchInput";

import useConversation from "../../../zustand/useConversation";

const ChatSideBar = () => {
	const { selectedConversation } = useConversation();

	return (
		<>
			<div
				className={`md:flex-[2_2_0] md:w-18 md:max-w-72 p-3 w-screen mt-4 md:mt-0 border-l border-gray-700 ${
					selectedConversation && "hidden"
				} md:block`}
			>
				<SearchInput />
				<div className="divider px-3"></div>
				<Conversations />
			</div>
		</>
	);
};

export default ChatSideBar;
