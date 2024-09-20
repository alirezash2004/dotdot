import useGetConversations from "../../Hooks/useGetConversations";

import Loading from "../../common/Loading";
import Converasion from "./Conversation";

const Converasions = () => {
	const { loading, conversations } = useGetConversations();

	return (
		<div className="py-2 flex flex-col overflow-auto">
			{loading && <Loading />}

			{!loading && conversations.length === 0 && <p className="w-full text-center">No Conversations</p>}

			{conversations &&
				conversations?.map((conversation, idx) => (
					<Converasion
						key={idx}
						conversation={conversation}
						lastIdx={idx === conversations?.length - 1}
					/>
				))}
		</div>
	);
};

export default Converasions;
