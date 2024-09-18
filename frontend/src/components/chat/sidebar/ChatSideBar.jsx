import Converasions from "./Converasions";
import SearchInput from "./SearchInput";

const ChatSideBar = () => {
	return (
		<div className="md:flex-[2_2_0] md:w-18 md:max-w-72 p-3 w-screen mt-4 md:mt-0 border-l border-gray-700">
			<SearchInput />
			<div className="divider px-3"></div>
			<Converasions />
		</div>
	);
};

export default ChatSideBar;
