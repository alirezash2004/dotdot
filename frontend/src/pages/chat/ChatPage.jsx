import ChatMessageContainer from "../../components/chat/messages/ChatMessageContainer";
import ChatSideBar from "../../components/chat/sidebar/ChatSideBar";
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
