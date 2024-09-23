import { useState } from "react";
import toast from "react-hot-toast";

import useConversation from "../../../../zustand/useConversation";

import useGetConversations from "../../../../components/Hooks/useGetConversations";

import { CiSearch } from "react-icons/ci";

const SearchInput = () => {
	const [search, setSearch] = useState("");
	const { setSelectedConversation } = useConversation();
	const { conversations } = useGetConversations({ disableOnloadFetch: false });

	const handleSubmit = (e) => {
		e.preventDefault();
		if (!search || search.length < 3) {
			return toast.error("Search terms must be at least 3 characters");
		}

		const conversation = conversations.find((conversation) =>
			conversation.participants[0].fullName
				.toLowerCase()
				.includes(search.toLowerCase())
		);

		if (!conversation) {
			return toast.error("Conversation not found");
		}

		setSelectedConversation(conversation);
		setSearch("");
	};

	return (
		<form
			className="flex items-center justify-center md:justify-start gap-2"
			onSubmit={handleSubmit}
		>
			<input
				type="text"
				placeholder="search..."
				className="input input-bordered rounded-full"
				value={search}
				onChange={(e) => setSearch(e.target.value)}
			/>
			<button type="sumbit" className="btn btn-circle bg-accent text-white">
				<CiSearch className="text-3xl outline-none" />
			</button>
		</form>
	);
};

export default SearchInput;
