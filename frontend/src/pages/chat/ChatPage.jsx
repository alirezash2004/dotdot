import ChatMessageContainer from "./messageContainer/ChatMessageContainer";

import ChatSideBar from "./sideBar/ChatSideBar";
import useListenMessages from "../../components/Hooks/useListenMessages";

const ChatPage = () => {
	useListenMessages();

	return (
		<>
			<ChatMessageContainer />
			<ChatSideBar />
		</>
	);
};

export default ChatPage;
