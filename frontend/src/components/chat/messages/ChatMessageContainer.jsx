import { useEffect } from "react";

import ChatMessages from "./ChatMessages";
import ChatMessageInput from "./ChatMessageInput";

import useConversation from "../../../zustand/useConversation";

import { CiSquareAlert, CiSquareChevLeft } from "react-icons/ci";
import useGetConversations from "../../Hooks/useGetConversations";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useUsername } from "../../Hooks/useUsername";
import { usePageProfile } from "../../Hooks/usePageProfile";
import changeHost from "../../../utils/changeHost.js";

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

	const { loading, conversations } = useGetConversations({
		disableOnloadFetch: false,
	});

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

			if (!isSelected && targetPage.username !== authPage.username) {
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

				setTimeout(() => {
					if (!selectedConversation) {
						setSelectedConversation(conv);
					}
				}, 100);
			}
		}
	}

	return (
		<div
			className={`transition-all duration-500 md:min-w-[450px] md:flex-[4_4_0] flex flex-col w-screen md:w-auto h-[100vh] md:h-screen z-30 mb-1 md:mb-0 absolute top-0 md:-left-[0px] md:relative ${
				selectedConversation ? "-left-0" : "-left-[100vw] "
			}`}
		>
			{!selectedConversation ? (
				<NoChatSelected />
			) : (
				<>
					{/* header */}
					{/* <div className="bg-slate-500 px-4 py-2 mb-2 pb sticky top-0 z-50"> */}
					<div className="bg-slate-300 dark:bg-slate-800 px-4 py-2 mb-2 sticky top-0 z-50 flex items-center gap-2">
						<span
							className="text-3xl hover:scale-150 inline-flex transition-all pr-2"
							onClick={() => {
								setSelectedConversation(null);
								navigate("/chat");
							}}
						>
							<CiSquareChevLeft className="inline-flex" />
						</span>
						<Link
							to={`/profile/${selectedConversation?.participants[0].username}`}
							className="flex items-center gap-2"
						>
							<div className="avatar">
								<div className="w-10 rounded-full">
									<img
										src={changeHost(
											selectedConversation?.participants[0].profilePicture
										)}
									/>
								</div>
							</div>
							<span className="text-gray-800 dark:text-gray-300 font-bold">
								{selectedConversation?.participants[0].fullName}
							</span>
						</Link>
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
