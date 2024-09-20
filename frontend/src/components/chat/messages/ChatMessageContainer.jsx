import { useEffect } from "react";

import ChatMessages from "./ChatMessages";
import ChatMessageInput from "./ChatMessageInput";

import useConversation from "../../../zustand/useConversation";

import { CiSquareAlert, CiSquareChevLeft } from "react-icons/ci";
import useGetConversations from "../../Hooks/useGetConversations";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { useUsername } from "../../Hooks/useUsername";
import { usePageProfile } from "../../Hooks/usePageProfile";

const NoChatSelected = () => {
	return (
		<div className="hidden md:flex flex-col items-center justify-center w-full h-full gap-5 text-xl">
			<CiSquareAlert className="text-5xl" />
			<p>There is no chat selected</p>
			<p>Select a conversation</p>
		</div>
	);
};

const ChatMessageContainer = () => {
	const navigate = useNavigate();
	const queryClinet = useQueryClient();
	const { selectedConversation, setSelectedConversation } = useConversation();

	useEffect(() => {
		return () => {
			setSelectedConversation(null);
		};
	}, [setSelectedConversation]);

	const { loading, conversations } = useGetConversations();

	const { username: paramUsername } = useParams();

	const { data: authPage } = useQuery({ queryKey: ["authPage"] });

	const { isValidUsername, isMyProfile } = useUsername({
		username: paramUsername,
		authUsername: authPage.username,
	});

	const { targetPage, fetchPageOnly } = usePageProfile({
		username: paramUsername,
		isMyProfile: isMyProfile,
		authPageId: authPage._id,
		disable: true,
	});

	const fetchProfilePage = async () => {
		await fetchPageOnly();
	};

	if (paramUsername && isValidUsername) {
		if (!targetPage) {
			fetchProfilePage();
		} else {
			const conv = {
				participants: [
					{
						fullName: targetPage?.fullName,
						profilePicture: targetPage?.profilePicture,
						username: targetPage?.username,
						_id: targetPage?._id,
					},
				],
				lastMessage: {
					from: authPage?._id,
					text: "",
					read: true,
				},
			};

			const isSelected =
				selectedConversation?.participants[0].username ===
				conv.participants[0].username;
			console.log(isSelected);

			if (!isSelected) {
				const conversation = conversations?.find((conversation) =>
					conversation.participants[0].username
						.toLowerCase()
						.includes(targetPage?.username.toLowerCase())
				);

				if (!conversation) {
					queryClinet.setQueryData(["chatConversations"], (old) => {
						if (old) {
							return [conv, ...old];
						} else {
							return [conv];
						}
					});
				}
				console.log(selectedConversation);

				setTimeout(() => {
					if (!selectedConversation) {
						setSelectedConversation(conv);
					}
				}, 100);
			}
		}
	}

	return (
		<div className="md:min-w-[450px] md:flex-[4_4_0] flex flex-col w-screen md:w-auto h-[94vh] md:h-screen z-30 pb-20 md:pb-0">
			{!selectedConversation ? (
				<NoChatSelected />
			) : (
				<>
					{/* header */}
					<div className="bg-slate-500 px-4 py-2 mb-2 pb sticky top-0 z-50">
						<span
							className="text-3xl pr-2 md:hidden hover:scale-150 inline-flex transition-all relative top-[2px]"
							onClick={() => {
								setSelectedConversation(null);
								navigate("/chat");
							}}
						>
							<CiSquareChevLeft className="inline-flex" />
						</span>
						<span className="label-text relative -top-2 md:top-0">To: </span>
						<span className="text-gray-900 font-bold relative -top-2 md:top-0">
							{selectedConversation?.participants[0].fullName}
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
