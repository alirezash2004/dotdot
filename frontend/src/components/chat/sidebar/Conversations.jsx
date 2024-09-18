import useGetConversations from "../../Hooks/useGetConversations";

import Loading from "../../common/Loading";
import Converasion from "./Conversation";

const Converasions = () => {
	const { loading, conversations } = useGetConversations();
	console.log("Conversations", conversations);

	return (
		<div className="py-2 flex flex-col overflow-auto">
			{loading && <Loading />}

			{conversations.map((conversation, idx) => (
				<Converasion
					key={conversation._id}
					conversation={conversation}
					lastIdx={idx === conversations.length - 1}
				/>
			))}
		</div>
	);
};

export default Converasions;
