import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import useUsername from "../../components/Hooks/useUsername";
import { useLogout } from "../../components/Hooks/useLogout";

import { CiBookmark, CiHeart, CiLogout, CiUser } from "react-icons/ci";

import SetPageTitle from "../../components/common/SetPageTitle";
import Loading from "../../components/common/Loading";

import Posts from "./ProfilePosts";
import ProfileHeader from "./ProfileHeader";

const ProfilePage = () => {
	const [islight, setIslight] = useState(
		JSON.parse(localStorage.getItem("islight"))
	);
	useEffect(() => {
		localStorage.setItem("islight", JSON.stringify(islight));
		if (islight) {
			document.documentElement.setAttribute("data-theme", "light");
		} else {
			document.documentElement.setAttribute("data-theme", "black");
		}
	}, [islight]);

	const [postFeedType, setPostFeedType] = useState("me");

	let { username: paramUsername } = useParams();

	const { logout, isLoggingOut, loggedOut } = useLogout();

	const { data: authPage } = useQuery({ queryKey: ["authPage"] });

	const { isValidUsername, isMyProfile, isValidatingUsername } = useUsername({
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
			return (
				<Posts
					pageUsername={paramUsername}
					postFeedType={postFeedType}
					isMyProfile={isMyProfile}
				/>
			);
		} else {
			return <></>;
		}
	}, [paramUsername, isValidUsername, postFeedType, isMyProfile]);

	return (
		<>
			<SetPageTitle title={`Profile ${paramUsername} - DotDot Social Media`} />

			<div className="absolute h-fit top-2 left-2 p-1 cursor-pointer md:mr-2 md:ml-6 border border-spacing-16  border-slate-600 hover:bg-slate-300 dark:hover:bg-slate-800 hover:fill-black flex items-center justify-center btn bg-transparent rounded gap-2 duration-100 py-2 px-2 max-w-fit md:pr-4 z-50 md:hidden">
				<label className="swap swap-rotate rounded-full w-8 h-8">
					{/* this hidden checkbox controls the state */}
					<input
						type="checkbox"
						className="theme-controller"
						onChange={() => setIslight((prevData) => !prevData)}
						checked={islight}
					/>

					{/* sun icon */}
					<svg
						className="swap-on h-7 w-7 fill-current"
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
					>
						<path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" />
					</svg>

					{/* moon icon */}
					<svg
						className="swap-off h-7 w-7 fill-current"
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
					>
						<path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" />
					</svg>
				</label>
				<span
					className=""
					onClick={() => setIslight((prevData) => !prevData)}
				>
					Theme
				</span>
			</div>

			{!isValidatingUsername && !isValidUsername ? (
				<>
					<div className="flex-[4_4_0] border-r border-gray-700 min-h-screen w-full items-center justify-center text-center pt-14 text-5xl text-rose-600">
						Invalid username
					</div>
				</>
			) : (
				<>
					<div className="flex-[4_4_0] border-r border-gray-700 min-h-screen relative mb-20">
						{isMyProfile && (
							<div
								className={`absolute h-fit top-2 right-2 md:hidden p-1 cursor-pointer md:mr-2 md:ml-6 border border-spacing-16  border-slate-600 hover:bg-slate-300 dark:hover:bg-slate-800 hover:fill-black duration-0 flex items-center justify-center btn bg-transparent rounded ${
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
			)}
		</>
	);
};

export default ProfilePage;
