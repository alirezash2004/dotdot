import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";

import { useUsername } from "../../components/Hooks/useUsername";
import { useLogout } from "../../components/Hooks/useLogout";

import {
	CiBookmark,
	CiHeart,
	CiLogout,
	CiUser,
} from "react-icons/ci";

import Loading from "../../components/common/Loading";

import Posts from "./ProfilePosts";
import ProfileHeader from "./ProfileHeader.jsx";

const ProfilePage = () => {
	const [postFeedType, setPostFeedType] = useState("me");

	let { username: paramUsername } = useParams();

	const { logout, isLoggingOut, loggedOut } = useLogout();

	const { data: authPage } = useQuery({ queryKey: ["authPage"] });

	const { isValidUsername, isMyProfile } = useUsername({
		username: paramUsername,
		authUsername: authPage.username,
	});

	const renderProfileHeader = useMemo(() => {
		if (isValidUsername) {
			return <ProfileHeader pageUsername={paramUsername} />;
		} else {
			return <></>;
		}
	}, [paramUsername, isValidUsername]);

	const renderPosts = useMemo(() => {
		if (isValidUsername) {
			return <Posts pageUsername={paramUsername} />;
		} else {
			return <></>;
		}
	}, [paramUsername, isValidUsername]);

	if (!isValidUsername) {
		return (
			<>
				<div className="flex-[4_4_0] border-r border-gray-700 min-h-screen w-full items-center justify-center text-center pt-14 text-5xl text-rose-600">
					Invalid username
				</div>
			</>
		);
	}

	return (
		<>
			<Helmet>
				<title>
					Profile {isValidUsername && `- ${paramUsername}`} - DotDot Social
					Media
				</title>
			</Helmet>
			<div className="flex-[4_4_0] border-r border-gray-700 min-h-screen relative mb-20">
				{isMyProfile && (
					<div
						className={`absolute h-fit top-0 right-0 md:hidden p-1 cursor-pointer md:mr-2 md:ml-6 border border-spacing-16 rounded-none border-l-slate-600 border-b-slate-600 hover:bg-slate-600 hover:fill-black transition-all duration-300 flex items-center justify-center btn ${
							isLoggingOut || loggedOut ? "btn-disabled" : ""
						}`}
						onClick={(e) => {
							e.preventDefault();
							logout();
						}}
					>
						{(isLoggingOut || loggedOut) && (
							<Loading className="w-full h-full" />
						)}
						{!isLoggingOut && !loggedOut && (
							<div className="flex items-center gap-2 px-3">
								<CiLogout className="text-2xl" />
								<span>Logout</span>
							</div>
						)}
					</div>
				)}
				{renderProfileHeader}
				{isMyProfile && (
					<>
						<div role="tablist" className="tabs tabs-bordered tabs-lg">
							<a
								role="tab"
								className={`tab flex gap-2 ${
									postFeedType === "me" ? "tab-active" : ""
								}`}
								onClick={() => setPostFeedType("me")}
							>
								<span>Me</span>
								<CiUser className="w-6 h-6" />
							</a>
							<a
								role="tab"
								className={`tab flex gap-2 ${
									postFeedType === "saved" ? "tab-active" : ""
								}`}
								onClick={() => setPostFeedType("saved")}
							>
								<span>Saved</span>
								<CiBookmark className="w-6 h-6" />
							</a>
							<a
								role="tab"
								className={`tab flex gap-2 ${
									postFeedType === "liked" ? "tab-active" : ""
								}`}
								onClick={() => setPostFeedType("liked")}
							>
								<span>Liked</span>
								<CiHeart className="w-6 h-6" />
							</a>
						</div>
						{/* <Posts pageUsername={paramUsername} postFeedType={postFeedType} /> */}
						{renderPosts}
					</>
				)}{" "}
				{/* Fucking 3 days for this */}
				{!isMyProfile && renderPosts}
			</div>

		</>
	);
};

export default ProfilePage;
